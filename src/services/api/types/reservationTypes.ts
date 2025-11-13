export interface BackendRider {
  id: string;
  vehicleType: string | null;
  ride_type_id: string;
  licenseNumber: string;
  zoneId: string;
  availabilityStatus: string;
  user_profile_id: string;
  linked_store_id: string | null;
  linked_admin_id: string | null;
  type: string;
  is_approved: boolean;
  status: string;

  // ✅ Missing fields from backend
  is_onboarding_completed: boolean;
  driver_license_front: string | null;
  driver_license_back: string | null;
  national_id_passport_front: string | null;
  national_id_passport_back: string | null;
  vehicle_registration_front: string | null;
  vehicle_registration_back: string | null;
  company_commercial_registration: string | null;
  model_year_limit: string | null;
  is_four_wheeler: boolean;
  air_conditioning: boolean;
  no_cosmetic_damage: boolean;
}

export interface BackendRide {
  id: string;
  ride_request_id: string;
  rider_id: string;
  passenger_id: string;
  agreed_price: string;
  status: string;
  expires_at: string | null;
  cancelled_by: string | null;
  courier_detail_id: string | null;
  isScheduled: boolean;
  scheduledAt: string | null;
  payment_via: string;
  completed_At: string | null;
  is_hourly: boolean;
  createdAt: string;
  updatedAt: string;
  admin_tier_commission: string | null;
  admin_commission_rule_commission: string | null;
  rider: BackendRider;
}

export interface BackendReservationsResponse {
  allRides: BackendRide[];
}

export interface GetReservationsRequest {
  offset?: number;
}
