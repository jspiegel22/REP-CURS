export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: number
          first_name: string
          last_name: string | null
          email: string
          phone: string | null
          preferred_contact_method: string | null
          preferred_contact_time: string | null
          source: string
          status: string
          form_name: string | null
          form_data: Json | null
          notes: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          tags: string[] | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          created_at: string | null
          updated_at: string | null
          booking_type: string
          start_date: string
          end_date: string
          guests: number
          total_amount: number | null
          currency: string | null
          payment_status: string | null
          payment_method: string | null
          special_requests: string | null
          budget: string | null
          listing_id: number | null
        }
        Insert: {
          id?: number
          first_name: string
          last_name?: string | null
          email: string
          phone?: string | null
          preferred_contact_method?: string | null
          preferred_contact_time?: string | null
          source: string
          status: string
          form_name?: string | null
          form_data?: Json | null
          notes?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          tags?: string[] | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string | null
          updated_at?: string | null
          booking_type: string
          start_date: string
          end_date: string
          guests: number
          total_amount?: number | null
          currency?: string | null
          payment_status?: string | null
          payment_method?: string | null
          special_requests?: string | null
          budget?: string | null
          listing_id?: number | null
        }
        Update: {
          id?: number
          first_name?: string
          last_name?: string | null
          email?: string
          phone?: string | null
          preferred_contact_method?: string | null
          preferred_contact_time?: string | null
          source?: string
          status?: string
          form_name?: string | null
          form_data?: Json | null
          notes?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          tags?: string[] | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string | null
          updated_at?: string | null
          booking_type?: string
          start_date?: string
          end_date?: string
          guests?: number
          total_amount?: number | null
          currency?: string | null
          payment_status?: string | null
          payment_method?: string | null
          special_requests?: string | null
          budget?: string | null
          listing_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "listings"
            referencedColumns: ["id"]
          }
        ]
      }
      guide_submissions: {
        Row: {
          id: number
          first_name: string
          last_name: string | null
          email: string
          phone: string | null
          preferred_contact_method: string | null
          preferred_contact_time: string | null
          source: string
          status: string
          form_name: string | null
          form_data: Json | null
          notes: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          tags: string[] | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          created_at: string | null
          updated_at: string | null
          guide_type: string
          interest_areas: string[] | null
          travel_dates: string | null
          number_of_travelers: number | null
          download_link: string | null
          processed_at: string | null
          submission_id: string
        }
        Insert: {
          id?: number
          first_name: string
          last_name?: string | null
          email: string
          phone?: string | null
          preferred_contact_method?: string | null
          preferred_contact_time?: string | null
          source: string
          status: string
          form_name?: string | null
          form_data?: Json | null
          notes?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          tags?: string[] | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string | null
          updated_at?: string | null
          guide_type: string
          interest_areas?: string[] | null
          travel_dates?: string | null
          number_of_travelers?: number | null
          download_link?: string | null
          processed_at?: string | null
          submission_id: string
        }
        Update: {
          id?: number
          first_name?: string
          last_name?: string | null
          email?: string
          phone?: string | null
          preferred_contact_method?: string | null
          preferred_contact_time?: string | null
          source?: string
          status?: string
          form_name?: string | null
          form_data?: Json | null
          notes?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          tags?: string[] | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string | null
          updated_at?: string | null
          guide_type?: string
          interest_areas?: string[] | null
          travel_dates?: string | null
          number_of_travelers?: number | null
          download_link?: string | null
          processed_at?: string | null
          submission_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: number
          first_name: string
          last_name: string | null
          email: string
          phone: string | null
          preferred_contact_method: string | null
          preferred_contact_time: string | null
          source: string
          status: string
          form_name: string | null
          form_data: Json | null
          notes: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          tags: string[] | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          created_at: string | null
          updated_at: string | null
          interest_type: string
          budget: string | null
          timeline: string | null
          priority: string | null
          assigned_to: string | null
        }
        Insert: {
          id?: number
          first_name: string
          last_name?: string | null
          email: string
          phone?: string | null
          preferred_contact_method?: string | null
          preferred_contact_time?: string | null
          source: string
          status: string
          form_name?: string | null
          form_data?: Json | null
          notes?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          tags?: string[] | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string | null
          updated_at?: string | null
          interest_type: string
          budget?: string | null
          timeline?: string | null
          priority?: string | null
          assigned_to?: string | null
        }
        Update: {
          id?: number
          first_name?: string
          last_name?: string | null
          email?: string
          phone?: string | null
          preferred_contact_method?: string | null
          preferred_contact_time?: string | null
          source?: string
          status?: string
          form_name?: string | null
          form_data?: Json | null
          notes?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          tags?: string[] | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string | null
          updated_at?: string | null
          interest_type?: string
          budget?: string | null
          timeline?: string | null
          priority?: string | null
          assigned_to?: string | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          id: number
          title: string
          description: string
          type: string
          image_url: string
          price: number | null
          location: string
          booking_type: string
          partner_id: number | null
        }
        Insert: {
          id?: number
          title: string
          description: string
          type: string
          image_url: string
          price?: number | null
          location: string
          booking_type: string
          partner_id?: number | null
        }
        Update: {
          id?: number
          title?: string
          description?: string
          type?: string
          image_url?: string
          price?: number | null
          location?: string
          booking_type?: string
          partner_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_partner_id_fkey"
            columns: ["partner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      resorts: {
        Row: {
          id: number
          name: string
          rating: number
          review_count: number
          price_level: string
          location: string
          description: string
          image_url: string
          amenities: Json
          rooms: number
          max_guests: number
          is_beachfront: boolean | null
          is_oceanfront: boolean | null
          google_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          rating: number
          review_count: number
          price_level: string
          location: string
          description: string
          image_url: string
          amenities: Json
          rooms: number
          max_guests: number
          is_beachfront?: boolean | null
          is_oceanfront?: boolean | null
          google_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          rating?: number
          review_count?: number
          price_level?: string
          location?: string
          description?: string
          image_url?: string
          amenities?: Json
          rooms?: number
          max_guests?: number
          is_beachfront?: boolean | null
          is_oceanfront?: boolean | null
          google_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rewards: {
        Row: {
          id: number
          name: string
          description: string
          points_required: number
          type: string
          value: number
          active: boolean | null
        }
        Insert: {
          id?: number
          name: string
          description: string
          points_required: number
          type: string
          value: number
          active?: boolean | null
        }
        Update: {
          id?: number
          name?: string
          description?: string
          points_required?: number
          type?: string
          value?: number
          active?: boolean | null
        }
        Relationships: []
      }
      session: {
        Row: {
          sid: string
          sess: Json
          expire: string
        }
        Insert: {
          sid: string
          sess: Json
          expire: string
        }
        Update: {
          sid?: string
          sess?: Json
          expire?: string
        }
        Relationships: []
      }
      social_shares: {
        Row: {
          id: number
          user_id: number | null
          listing_id: number | null
          platform: string
          shared_at: string | null
          points_earned: number | null
        }
        Insert: {
          id?: number
          user_id?: number | null
          listing_id?: number | null
          platform: string
          shared_at?: string | null
          points_earned?: number | null
        }
        Update: {
          id?: number
          user_id?: number | null
          listing_id?: number | null
          platform?: string
          shared_at?: string | null
          points_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "social_shares_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_shares_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: number
          username: string
          password: string
          role: string
          points: number | null
          level: number | null
          email: string | null
        }
        Insert: {
          id?: number
          username: string
          password: string
          role?: string
          points?: number | null
          level?: number | null
          email?: string | null
        }
        Update: {
          id?: number
          username?: string
          password?: string
          role?: string
          points?: number | null
          level?: number | null
          email?: string | null
        }
        Relationships: []
      }
      villas: {
        Row: {
          id: number
          name: string
          description: string
          bedrooms: number
          bathrooms: number
          max_guests: number
          amenities: Json
          image_url: string
          image_urls: Json
          price_per_night: number
          location: string
          address: string
          latitude: number | null
          longitude: number | null
          trackhs_id: string | null
          last_synced_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          description: string
          bedrooms: number
          bathrooms: number
          max_guests: number
          amenities?: Json
          image_url: string
          image_urls?: Json
          price_per_night: number
          location: string
          address: string
          latitude?: number | null
          longitude?: number | null
          trackhs_id?: string | null
          last_synced_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          description?: string
          bedrooms?: number
          bathrooms?: number
          max_guests?: number
          amenities?: Json
          image_url?: string
          image_urls?: Json
          price_per_night?: number
          location?: string
          address?: string
          latitude?: number | null
          longitude?: number | null
          trackhs_id?: string | null
          last_synced_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      weather_cache: {
        Row: {
          id: number
          location: string
          data: Json
          updated_at: string | null
        }
        Insert: {
          id?: number
          location: string
          data: Json
          updated_at?: string | null
        }
        Update: {
          id?: number
          location?: string
          data?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}