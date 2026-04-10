-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'tutor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  grade TEXT NOT NULL,
  desired_school TEXT,
  high_school TEXT,
  gender TEXT,
  area TEXT,
  course_type TEXT,
  exam_type TEXT,
  score_band TEXT,
  strong_subjects TEXT[],
  weak_subjects TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutor profiles
CREATE TABLE tutor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  nickname TEXT NOT NULL,
  gender TEXT,
  university_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  available_subjects TEXT[] NOT NULL,
  available_formats TEXT[] NOT NULL,
  available_days TEXT[],
  available_time_slots TEXT[],
  specialties TEXT,
  self_pr TEXT,
  average_rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutor verifications
CREATE TABLE tutor_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  academic_email_verified BOOLEAN DEFAULT FALSE,
  student_id_card_submitted BOOLEAN DEFAULT FALSE,
  student_id_card_verified BOOLEAN DEFAULT FALSE,
  student_id_card_path TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requests
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_user_id UUID NOT NULL REFERENCES users(id),
  format TEXT NOT NULL CHECK (format IN ('授業', '添削', '相談')),
  category TEXT NOT NULL CHECK (category IN ('英語', '数学', '化学', '生物', '物理', '小論文', '面接', '学習計画', '推薦対策', 'その他相談')),
  budget INTEGER,
  message TEXT NOT NULL,
  preferred_datetime TIMESTAMPTZ,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'matched', 'closed', 'cancelled')),
  selected_proposal_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Request attachments
CREATE TABLE request_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  tutor_user_id UUID NOT NULL REFERENCES users(id),
  proposed_price INTEGER NOT NULL,
  proposed_datetime TIMESTAMPTZ,
  appeal_message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(request_id, tutor_user_id)
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id),
  proposal_id UUID NOT NULL REFERENCES proposals(id),
  student_user_id UUID NOT NULL REFERENCES users(id),
  tutor_user_id UUID NOT NULL REFERENCES users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) UNIQUE,
  student_user_id UUID NOT NULL REFERENCES users(id),
  tutor_user_id UUID NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for selected_proposal_id after proposals table exists
ALTER TABLE requests ADD CONSTRAINT fk_selected_proposal
  FOREIGN KEY (selected_proposal_id) REFERENCES proposals(id);

-- Indexes for performance
CREATE INDEX idx_requests_student ON requests(student_user_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_proposals_request ON proposals(request_id);
CREATE INDEX idx_proposals_tutor ON proposals(tutor_user_id);
CREATE INDEX idx_matches_student ON matches(student_user_id);
CREATE INDEX idx_matches_tutor ON matches(tutor_user_id);
CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_reviews_tutor ON reviews(tutor_user_id);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Student profiles policies
CREATE POLICY "Students can view their own profile" ON student_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own profile" ON student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile" ON student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Tutor profiles policies
CREATE POLICY "Anyone can view tutor profiles" ON tutor_profiles
  FOR SELECT USING (true);

CREATE POLICY "Tutors can insert their own profile" ON tutor_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tutors can update their own profile" ON tutor_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Tutor verifications policies
CREATE POLICY "Tutors can view their own verification" ON tutor_verifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Tutors can insert their own verification" ON tutor_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tutors can update their own verification" ON tutor_verifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Requests policies
CREATE POLICY "Students can view their own requests" ON requests
  FOR SELECT USING (auth.uid() = student_user_id);

CREATE POLICY "Tutors can view open requests" ON requests
  FOR SELECT USING (status = 'open');

CREATE POLICY "Students can create requests" ON requests
  FOR INSERT WITH CHECK (auth.uid() = student_user_id);

CREATE POLICY "Students can update their own requests" ON requests
  FOR UPDATE USING (auth.uid() = student_user_id);

-- Request attachments policies
CREATE POLICY "Request owners can view attachments" ON request_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM requests WHERE requests.id = request_attachments.request_id
      AND (requests.student_user_id = auth.uid() OR requests.status = 'open')
    )
  );

CREATE POLICY "Students can insert attachments" ON request_attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM requests WHERE requests.id = request_attachments.request_id
      AND requests.student_user_id = auth.uid()
    )
  );

-- Proposals policies
CREATE POLICY "Request owners can view proposals" ON proposals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM requests WHERE requests.id = proposals.request_id
      AND requests.student_user_id = auth.uid()
    )
  );

CREATE POLICY "Tutors can view their own proposals" ON proposals
  FOR SELECT USING (auth.uid() = tutor_user_id);

CREATE POLICY "Tutors can create proposals" ON proposals
  FOR INSERT WITH CHECK (auth.uid() = tutor_user_id);

CREATE POLICY "Tutors can update their own proposals" ON proposals
  FOR UPDATE USING (auth.uid() = tutor_user_id);

-- Matches policies
CREATE POLICY "Match participants can view matches" ON matches
  FOR SELECT USING (auth.uid() = student_user_id OR auth.uid() = tutor_user_id);

CREATE POLICY "Students can create matches" ON matches
  FOR INSERT WITH CHECK (auth.uid() = student_user_id);

CREATE POLICY "Match participants can update matches" ON matches
  FOR UPDATE USING (auth.uid() = student_user_id OR auth.uid() = tutor_user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Students can create reviews for their matches" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = student_user_id AND
    EXISTS (
      SELECT 1 FROM matches WHERE matches.id = reviews.match_id
      AND matches.student_user_id = auth.uid()
    )
  );

-- Messages policies
CREATE POLICY "Match participants can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches WHERE matches.id = messages.match_id
      AND (matches.student_user_id = auth.uid() OR matches.tutor_user_id = auth.uid())
    )
  );

CREATE POLICY "Match participants can send messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches WHERE matches.id = messages.match_id
      AND (matches.student_user_id = auth.uid() OR matches.tutor_user_id = auth.uid())
    )
  );

-- Function to update tutor rating
CREATE OR REPLACE FUNCTION update_tutor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tutor_profiles
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE tutor_user_id = NEW.tutor_user_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE tutor_user_id = NEW.tutor_user_id
    ),
    updated_at = NOW()
  WHERE user_id = NEW.tutor_user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update tutor rating on new review
CREATE TRIGGER on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_tutor_rating();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tutor_profiles_updated_at
  BEFORE UPDATE ON tutor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
