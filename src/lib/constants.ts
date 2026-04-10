export const SUBJECTS = [
  '英語',
  '数学',
  '化学',
  '生物',
  '物理',
  '小論文',
  '面接',
  '学習計画',
  '推薦対策',
  'その他相談',
] as const

export const FORMATS = ['授業', '添削', '相談'] as const

export const DAYS = ['月', '火', '水', '木', '金', '土', '日'] as const

export const TIME_SLOTS = [
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
  '18:00-21:00',
  '21:00-24:00',
] as const

export const STUDENT_GRADES = [
  '高校1年',
  '高校2年',
  '高校3年',
  '浪人1年目',
  '浪人2年目以上',
  '社会人',
] as const

export const TUTOR_GRADES = [
  '医学部1年',
  '医学部2年',
  '医学部3年',
  '医学部4年',
  '医学部5年',
  '医学部6年',
  '研修医',
] as const

export const GENDERS = ['男性', '女性', '回答しない'] as const

export const COURSE_TYPES = ['文系', '理系'] as const

export const EXAM_TYPES = ['一般入試', '推薦入試', '総合型選抜', 'その他'] as const

export const SCORE_BANDS = [
  '偏差値50未満',
  '偏差値50-55',
  '偏差値55-60',
  '偏差値60-65',
  '偏差値65-70',
  '偏差値70以上',
] as const

export const REQUEST_STATUS = {
  open: '募集中',
  matched: 'マッチ済み',
  closed: '終了',
  cancelled: 'キャンセル',
} as const

export const PROPOSAL_STATUS = {
  pending: '審査中',
  accepted: '採用',
  rejected: '不採用',
} as const

export const MATCH_STATUS = {
  active: '進行中',
  completed: '完了',
  cancelled: 'キャンセル',
} as const
