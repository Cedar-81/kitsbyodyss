import { create } from 'zustand';
import { supabase } from '../supabase';

// ============== TYPES ==============

export interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

export interface Overview {
  id?: string;
  title: string;
  location: string;
  budget: number;
  budget_currency_code: string;
  duration: number;
  duration_time_frame: string;
  main_image?: string;
  price?: number;
  published?: boolean;
  user_id?: string;
  [key: string]: any;
}

export interface FoodItem {
  id?: string;
  overview_id: string;
  name: string;
  location: string;
  landmark?: string;
  booking_link?: string;
  price?: number;
  currency_code: string;
  rating?: string;
  review?: string;
  notes: string[];
  image?: string;
  user_id?: string;
  [key: string]: any;
}

export interface AccommodationItem {
  id?: string;
  overview_id: string;
  name: string;
  location: string;
  booking_link?: string;
  price?: number;
  currency_code: string;
  frequency?: string;
  rating?: string;
  review?: string;
  notes: string[];
  image?: string;
  user_id?: string;
  [key: string]: any;
}

export interface ActivityItem {
  id?: string;
  overview_id: string;
  name: string;
  location: string;
  booking_link?: string;
  price?: number;
  currency_code: string;
  frequency?: string;
  rating?: string;
  review?: string;
  notes: string[];
  image?: string;
  user_id?: string;
  [key: string]: any;
}

export interface TransportationItem {
  id?: string;
  overview_id: string;
  [key: string]: any;
}

export interface KitItem {
  id?: string;
  name: string;
  access_price?: number;
  trip_price?: number;
  location?: string;
  trip_duration?: number;
  trip_duration_time_frame?: string;
  description?: string;
  budget_currency_code?: string;
  access_currency_code?: string;
  images?: string[];
  user_id?: string;
  [key: string]: any;
}

export interface Profile {
  id?: string,
  username: string,
  display_name: string,
  user_id?: string,
  [key: string]: any;
}

// ============== STORES ==============

// -------- General Store --------
export interface GeneralStore {
  isKitOwner: (kit_id: string) => Promise<boolean>;
}

export const useGeneralStore = create<GeneralStore>(() => ({
  isKitOwner: async (kit_user_id: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return false;

    return kit_user_id === user.id;
  },
}));

// -------- User Store --------
export interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

// -------- Profile Store --------
export interface ProfileStore {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  clearProfile: () => void;
  updateProfileFormField: (field: string, value: any) => void;
  profileFormData: {
    username: string,
    display_name: string,
  },
  // whether the form is currently editing an existing item
  isUpdating: boolean;
  currentProfileId: string | null;
  // helpers for update flow
  setIsUpdating: (updating: boolean) => void;
  setCurrentProfileId: (id: string | null) => void;
  populateProfileForm: (item: Profile) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  isUpdating: false,
  currentProfileId: null,
  profileFormData: {
    username: '',
    display_name: ''
  },
  clearProfile: () => set({ profile: null }),
  setIsUpdating: (updating) => set({ isUpdating: updating }),
  setCurrentProfileId: (id) => set({ currentProfileId: id }),
  updateProfileFormField: (field, value) =>
    set((state) => ({
      profileFormData: {
        ...state.profileFormData,
        [field]: value,
      },
    })),
  populateProfileForm: (item) =>
    set({
      profileFormData: {
        username: item.username || "",
        display_name: item.display_name || "",
      },
    }),
}));

// -------- Overview Store --------
export interface OverviewStore {
  overview: Overview | null;
  overviewList: Overview[];
  setOverview: (overview: Overview | null) => void;
  setOverviewList: (overviews: Overview[]) => void;
  clearOverview: () => void;
  // whether the form is currently editing an existing item
  isUpdating: boolean;
  currentOverviewId: string | null;
  // helpers for update flow
  setIsUpdating: (updating: boolean) => void;
  setCurrentOverviewId: (id: string | null) => void;
  populateOverviewForm: (item: Overview) => void;
}

export const useOverviewStore = create<OverviewStore>((set) => ({
  overview: null,
  overviewList: [],
  isUpdating: false,
  currentOverviewId: null,
  setOverview: (overview) => set({ overview }),
  setOverviewList: (overviewList) => set({ overviewList }),
  clearOverview: () => set({ overview: null }),
  setIsUpdating: (updating) => set({ isUpdating: updating }),
  setCurrentOverviewId: (id) => set({ currentOverviewId: id }),
  populateOverviewForm: (item) =>
    set({
      overview: {
        title: item.title || '',
        location: item.location || '',
        budget: item.budget || 0,
        budget_currency_code: item.budget_currency_code || 'USD',
        duration: item.duration || 0,
        duration_time_frame: item.duration_time_frame || 'days',
        main_image: item.main_image || undefined,
        price: item.price != null ? item.price : 0,
      },
    }),
}));

// -------- Food Store --------
export interface FoodStore {
  foodList: FoodItem[];
  foodLoading: boolean;
  // form state used by new_food page
  foodFormData: {
    name: string;
    location: string;
    landmark?: string;
    booking_link?: string;
    price: string;
    currency_code: string;
    rating: string | null;
    notes: string[];
    review: string;
    image: string | null;
    imageFile: File | null;
  };
  // whether the form is currently editing an existing item
  isUpdating: boolean;
  currentFoodId: string | null;
  setFoodList: (items: FoodItem[]) => void;
  setFoodLoading: (loading: boolean) => void;
  updateFoodFormField: (field: string, value: any) => void;
  resetFoodForm: () => void;
  addFoodItem: (item: FoodItem) => void;
  // helpers for update flow
  setIsUpdating: (updating: boolean) => void;
  setCurrentFoodId: (id: string | null) => void;
  populateFoodForm: (item: FoodItem) => void;
}

const defaultFoodFormData = {
  name: '',
  location: '',
  landmark: '',
  booking_link: '',
  price: '',
  currency_code: 'USD',
  rating: null,
  notes: [],
  review: '',
  image: null,
  imageFile: null,
};

export const useFoodStore = create<FoodStore>((set) => ({
  foodList: [],
  foodLoading: false,
  foodFormData: defaultFoodFormData,
  isUpdating: false,
  currentFoodId: null,
  setFoodList: (foodList) => set({ foodList }),
  setFoodLoading: (foodLoading) => set({ foodLoading }),
  updateFoodFormField: (field, value) =>
    set((state) => ({
      foodFormData: {
        ...state.foodFormData,
        [field]: value,
      },
    })),
  resetFoodForm: () =>
    set({ foodFormData: defaultFoodFormData, isUpdating: false, currentFoodId: null }),
  addFoodItem: (item: FoodItem) =>
    set((state) => ({
      foodList: [...state.foodList, item],
    })),
  setIsUpdating: (updating) => set({ isUpdating: updating }),
  setCurrentFoodId: (id) => set({ currentFoodId: id }),
  populateFoodForm: (item) =>
    set({
      foodFormData: {
        name: item.name || '',
        location: item.location || '',
        landmark: item.landmark || '',
        booking_link: item.booking_link || '',
        price: item.price != null ? String(item.price) : '',
        currency_code: item.currency_code || 'USD',
        rating: item.rating || null,
        notes: item.notes || [],
        review: item.review || '',
        image: item.image || null,
        imageFile: null,
      },
    }),
}));

// -------- Accommodation Store --------
export interface AccommodationStore {
  accommodationList: AccommodationItem[];
  accommodationLoading: boolean;
  accommodationFormData: {
    name: string;
    location: string;
    booking_link?: string;
    price: string;
    currency_code: string;
    frequency: string | null;
    rating: string | null;
    landmark?: string;
    notes: string[];
    review: string;
    image: string | null;
    imageFile: File | null;
  };
  // update-mode state
  isUpdating: boolean;
  currentAccommodationId: string | null;
  setAccommodationList: (items: AccommodationItem[]) => void;
  setAccommodationLoading: (loading: boolean) => void;
  updateAccommodationFormField: (field: string, value: any) => void;
  resetAccommodationForm: () => void;
  addAccommodationItem: (item: AccommodationItem) => void;
  setIsUpdating: (updating: boolean) => void;
  setCurrentAccommodationId: (id: string | null) => void;
  populateAccommodationForm: (item: AccommodationItem) => void;
}

const defaultAccommodationFormData = {
  name: '',
  location: '',
  booking_link: '',
  price: '',
  landmark: '',
  currency_code: 'USD',
  frequency: "/day",
  rating: null,
  notes: [],
  review: '',
  image: null,
  imageFile: null,
};

export const useAccommodationStore = create<AccommodationStore>((set) => ({
  accommodationList: [],
  accommodationLoading: false,
  accommodationFormData: defaultAccommodationFormData,
  isUpdating: false,
  currentAccommodationId: null,
  setAccommodationList: (accommodationList) => set({ accommodationList }),
  setAccommodationLoading: (accommodationLoading) => set({ accommodationLoading }),
  updateAccommodationFormField: (field, value) =>
    set((state) => ({
      accommodationFormData: {
        ...state.accommodationFormData,
        [field]: value,
      },
    })),
  resetAccommodationForm: () => set({ accommodationFormData: defaultAccommodationFormData, isUpdating: false, currentAccommodationId: null }),
  addAccommodationItem: (item: AccommodationItem) =>
    set((state) => ({
      accommodationList: [...state.accommodationList, item],
    })),
  setIsUpdating: (updating) => set({ isUpdating: updating }),
  setCurrentAccommodationId: (id) => set({ currentAccommodationId: id }),
  populateAccommodationForm: (item) =>
    set({
      accommodationFormData: {
        name: item.name || '',
        location: item.location || '',
        landmark: item.landmark || '',
        booking_link: item.booking_link || '',
        price: item.price != null ? String(item.price) : '',
        currency_code: item.currency_code || 'USD',
        frequency: item.duration || "/day",
        rating: item.rating || null,
        notes: item.notes || [],
        review: item.review || '',
        image: item.image || null,
        imageFile: null,
      },
    }),
}));

// -------- Activity Store --------
export interface ActivityStore {
  activityList: ActivityItem[];
  activityLoading: boolean;
  activityFormData: {
    name: string;
    location: string;
    landmark?: string;
    booking_link?: string;
    price: string;
    currency_code: string;
    frequency: string | null;
    rating: string | null;
    notes: string[];
    review: string;
    image: string | null;
    imageFile: File | null;
  };
  // update-mode state
  isUpdating: boolean;
  currentActivityId: string | null;
  setActivityList: (items: ActivityItem[]) => void;
  setActivityLoading: (loading: boolean) => void;
  updateActivityFormField: (field: string, value: any) => void;
  resetActivityForm: () => void;
  addActivityItem: (item: ActivityItem) => void;
  setIsUpdating: (updating: boolean) => void;
  setCurrentActivityId: (id: string | null) => void;
  populateActivityForm: (item: ActivityItem) => void;
}

const defaultActivityFormData = {
  name: '',
  location: '',
  booking_link: '',
  price: '',
  landmark: '',
  currency_code: 'USD',
  frequency: "/hour",
  rating: null,
  notes: [],
  review: '',
  image: null,
  imageFile: null,
};

export const useActivityStore = create<ActivityStore>((set) => ({
  activityList: [],
  activityLoading: false,
  activityFormData: defaultActivityFormData,
  isUpdating: false,
  currentActivityId: null,
  setActivityList: (activityList) => set({ activityList }),
  setActivityLoading: (activityLoading) => set({ activityLoading }),
  updateActivityFormField: (field, value) =>
    set((state) => ({
      activityFormData: {
        ...state.activityFormData,
        [field]: value,
      },
    })),
  resetActivityForm: () => set({ activityFormData: defaultActivityFormData, isUpdating: false, currentActivityId: null }),
  addActivityItem: (item: ActivityItem) =>
    set((state) => ({
      activityList: [...state.activityList, item],
    })),
  setIsUpdating: (updating) => set({ isUpdating: updating }),
  setCurrentActivityId: (id) => set({ currentActivityId: id }),
  populateActivityForm: (item) =>
    set({
      activityFormData: {
        name: item.name || '',
        location: item.location || '',
        booking_link: item.booking_link || '',
        landmark: item.landmark || '',
        price: item.price != null ? String(item.price) : '',
        currency_code: item.currency_code || 'USD',
        frequency: item.duration || "/hour",
        rating: item.rating || null,
        notes: item.notes || [],
        review: item.review || '',
        image: item.image || null,
        imageFile: null,
      },
    }),
}));

// -------- Transportation Store --------
export interface TransportationStore {
  transportationList: TransportationItem[];
  transportationLoading: boolean;
  setTransportationList: (items: TransportationItem[]) => void;
  setTransportationLoading: (loading: boolean) => void;
  addTransportationItem: (item: TransportationItem) => void;
}

export const useTransportationStore = create<TransportationStore>((set) => ({
  transportationList: [],
  transportationLoading: false,
  setTransportationList: (transportationList) => set({ transportationList }),
  setTransportationLoading: (transportationLoading) => set({ transportationLoading }),
  addTransportationItem: (item: TransportationItem) =>
    set((state) => ({
      transportationList: [...state.transportationList, item],
    })),
}));

// -------- Kit Store --------
export interface KitStore {
  kitFormData: {
    name: string;
    access_price: string;
    trip_price: string;
    location: string;
    trip_duration: string;
    trip_duration_time_frame: string | null;
    description: string;
    budget_currency_code: string;
    access_currency_code: string;
    images: string[];
    imageFiles: (File | null)[];
  };
  kitLoading: boolean;
  updateKitFormField: (field: string, value: any) => void;
  updateKitImages: (index: number, image: string) => void;
  updateKitImageFiles: (index: number, file: File | null) => void;
  resetKitForm: () => void;
  setKitLoading: (loading: boolean) => void;
  // whether the form is currently editing an existing item
  isUpdating: boolean;
  currentKitId: string | null;
  // helpers for update flow
  setIsUpdating: (updating: boolean) => void;
  setCurrentKitId: (id: string | null) => void;
  populateKitForm: (item: KitItem) => void;
}

const defaultKitFormData = {
  name: '',
  access_price: '0',
  trip_price: '',
  location: '',
  trip_duration: '',
  trip_duration_time_frame: null,
  description: '',
  budget_currency_code: 'USD',
  access_currency_code: 'USD',
  images: ['', '', '', ''],
  imageFiles: [null, null, null, null],
};

export const useKitStore = create<KitStore>((set) => ({
  kitFormData: defaultKitFormData,
  kitLoading: false,
  isUpdating: false,
  currentKitId: null,
  updateKitFormField: (field, value) =>
    set((state) => ({
      kitFormData: {
        ...state.kitFormData,
        [field]: value,
      },
    })),
  updateKitImages: (index, image) =>
    set((state) => {
      const newImages = [...state.kitFormData.images];
      newImages[index] = image;
      return {
        kitFormData: {
          ...state.kitFormData,
          images: newImages,
        },
      };
    }),
  updateKitImageFiles: (index, file) =>
    set((state) => {
      const newImageFiles = [...state.kitFormData.imageFiles];
      newImageFiles[index] = file;
      return {
        kitFormData: {
          ...state.kitFormData,
          imageFiles: newImageFiles,
        },
      };
    }),
  resetKitForm: () => set({ kitFormData: defaultKitFormData }),
  setKitLoading: (kitLoading) => set({ kitLoading }),
  setIsUpdating: (updating) => set({ isUpdating: updating }),
  setCurrentKitId: (id) => set({ currentKitId: id }),
  populateKitForm: (item) =>
    set({
      kitFormData: {
        name: item.name || '',
        access_price: item.access_price?.toString() || "0",
        trip_price: item.trip_price?.toString() || "0",
        location: item.location || '',
        trip_duration: item.trip_duration?.toString() || '',
        trip_duration_time_frame: item.trip_duration_time_frame || null,
        description: item.description || '',
        budget_currency_code: item.budget_currency_code || 'USD',
        access_currency_code: item.access_currency_code || 'USD',
        images: item.images || ['', '', '', ''],
        imageFiles: item.imageFiles || [null, null, null, null],
      },
    }),
  
}));


// -------- UI Store (for component-level state like activeTab) --------
export interface UIStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'notes',
  setActiveTab: (activeTab) => set({ activeTab }),
}));
