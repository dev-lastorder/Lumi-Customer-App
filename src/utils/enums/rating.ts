export interface Rating {
    id: number;
    emoji: string;
    label: string;
    value: number;
  }
  
  export const RATINGS: Rating[] = [
    { id: 1, emoji: '😠', label: 'Terrible', value: 1 },
    { id: 2, emoji: '😞', label: 'Bad', value: 2 },
    { id: 3, emoji: '😐', label: 'Meh', value: 3 },
    { id: 4, emoji: '🙂', label: 'Good', value: 4 },
    { id: 5, emoji: '😍', label: 'Delightful', value: 5 }
  ];
  
  // Aspects for positive ratings (4-5 stars)
//   export const POSITIVE_ASPECTS: string[] = [
//     'Great taste',
//     'Perfect temperature', 
//     'Good portion size',
//     'Excellent packaging',
//     'Fresh ingredients',
//     'Quick delivery',
//     'Accurate order'
//   ];
  
  // Review steps enum
  export enum ReviewStep {
    RATING_SELECTION = 1,
    FEEDBACK_DETAILS = 2
  }