export const PROFILE_CHECKLIST = [
  { key: 'photo', label: 'Profil rasmi', icon: 'account-circle-outline' },
  { key: 'bio', label: "O'zingiz haqingizda", icon: 'text-box-outline' },
  { key: 'categories', label: 'Kamida 1 kategoriya', icon: 'briefcase-outline' },
  { key: 'certificates', label: 'Sertifikat', icon: 'certificate-outline' },
];

// Usta profilining "buyurtma qabul qilish"ga tayyorligini hisoblaydi —
// UstaMainScreen (onlayn tugmasi) va UstaProfileScreen (ogohlantirish) shu
// bitta hisobga tayanadi.
export function useProfileCompletion(user) {
  const checklistDone = {
    photo: !!user?.profile_photo,
    bio: !!(user?.bio && user.bio.trim()),
    categories: (user?.categories?.length ?? 0) > 0,
    certificates: (user?.certificates?.length ?? 0) > 0,
  };
  const doneCount = Object.values(checklistDone).filter(Boolean).length;
  const profilePercent = Math.round((doneCount / PROFILE_CHECKLIST.length) * 100);

  return {
    checklist: PROFILE_CHECKLIST,
    checklistDone,
    profilePercent,
    isComplete: profilePercent === 100,
  };
}
