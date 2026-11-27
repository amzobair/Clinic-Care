// Static data for the clinic. In a real app this would come from an API.
export const SPECIALTIES = [
  "Orthopedics",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
]

export const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "16:00", "16:30", "17:00", "17:30", "18:00"]

export const doctors = [
  {
    id: "rahman-ortho",
    name: "Dr. Ayesha Rahman",
    specialty: "Orthopedics",
    experience: 12,
    fee: 800,
    rating: 4.9,
    days: ["Sat", "Mon", "Wed"],
    initials: "AR",
    bio: "Treats joint pain, sports injuries and back problems. Focuses on exercise-first care before surgery.",
  },
  {
    id: "karim-cardio",
    name: "Dr. Tanvir Karim",
    specialty: "Cardiology",
    experience: 15,
    fee: 1000,
    rating: 4.8,
    days: ["Sun", "Tue", "Thu"],
    initials: "TK",
    bio: "Heart specialist for high blood pressure, chest pain and heart rhythm problems.",
  },
  {
    id: "hossain-derma",
    name: "Dr. Nusrat Hossain",
    specialty: "Dermatology",
    experience: 8,
    fee: 700,
    rating: 4.7,
    days: ["Sat", "Sun", "Tue"],
    initials: "NH",
    bio: "Skin, hair and nail care, including acne, eczema and allergy treatment.",
  },
  {
    id: "ahmed-peds",
    name: "Dr. Farhan Ahmed",
    specialty: "Pediatrics",
    experience: 10,
    fee: 600,
    rating: 4.9,
    days: ["Mon", "Wed", "Thu"],
    initials: "FA",
    bio: "Child health from newborns to teens: vaccines, growth checks and common illnesses.",
  },
  {
    id: "chowdhury-neuro",
    name: "Dr. Sabrina Chowdhury",
    specialty: "Neurology",
    experience: 14,
    fee: 1200,
    rating: 4.6,
    days: ["Sun", "Mon", "Thu"],
    initials: "SC",
    bio: "Headaches, migraines, seizures and nerve pain. Clear explanations, no rush.",
  },
  {
    id: "islam-ortho",
    name: "Dr. Mahmud Islam",
    specialty: "Orthopedics",
    experience: 6,
    fee: 650,
    rating: 4.5,
    days: ["Tue", "Thu", "Sat"],
    initials: "MI",
    bio: "Fractures, knee pain and posture problems for office workers and students.",
  },
]

export function getDoctor(id) {
  return doctors.find((d) => d.id === id)
}
