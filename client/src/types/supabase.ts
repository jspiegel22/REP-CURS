// This is a simplified type definition for Supabase
// You may want to generate the actual types using the Supabase CLI in the future

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
      villas: {
        Row: {
          id: number
          name: string
          trackHsId: string
          description: string
          bedrooms: number
          bathrooms: number
          maxGuests: number
          pricePerNight: number
          location: string
          lat: number | null
          lng: number | null
          amenities: string[]
          images: Json[]
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          name: string
          trackHsId: string
          description: string
          bedrooms: number
          bathrooms: number
          maxGuests: number
          pricePerNight: number
          location: string
          lat?: number | null
          lng?: number | null
          amenities: string[]
          images?: Json[]
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          name?: string
          trackHsId?: string
          description?: string
          bedrooms?: number
          bathrooms?: number
          maxGuests?: number
          pricePerNight?: number
          location?: string
          lat?: number | null
          lng?: number | null
          amenities?: string[]
          images?: Json[]
          createdAt?: string
          updatedAt?: string
        }
      }
      resorts: {
        Row: {
          id: number
          name: string
          description: string
          location: string
          rating: number
          reviewCount: number
          priceLevel: string
          amenities: string[]
          images: Json[]
          slug: string
          isBeachfront: boolean
          isOceanfront: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          location: string
          rating: number
          reviewCount: number
          priceLevel: string
          amenities: string[]
          images?: Json[]
          slug: string
          isBeachfront?: boolean
          isOceanfront?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          location?: string
          rating?: number
          reviewCount?: number
          priceLevel?: string
          amenities?: string[]
          images?: Json[]
          slug?: string
          isBeachfront?: boolean
          isOceanfront?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      users: {
        Row: {
          id: number
          username: string
          password: string
          email: string | null
          firstName: string | null
          lastName: string | null
          phoneNumber: string | null
          points: number
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          username: string
          password: string
          email?: string | null
          firstName?: string | null
          lastName?: string | null
          phoneNumber?: string | null
          points?: number
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          username?: string
          password?: string
          email?: string | null
          firstName?: string | null
          lastName?: string | null
          phoneNumber?: string | null
          points?: number
          createdAt?: string
          updatedAt?: string
        }
      }
      bookings: {
        Row: {
          id: number
          userId: number | null
          listingId: number | null
          resortId: number | null
          villaId: number | null
          checkIn: string
          checkOut: string
          guests: number
          specialRequests: string | null
          totalPrice: number
          status: string
          firstName: string
          lastName: string
          email: string
          phoneNumber: string
          paymentMethod: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          userId?: number | null
          listingId?: number | null
          resortId?: number | null
          villaId?: number | null
          checkIn: string
          checkOut: string
          guests: number
          specialRequests?: string | null
          totalPrice: number
          status: string
          firstName: string
          lastName: string
          email: string
          phoneNumber: string
          paymentMethod?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          userId?: number | null
          listingId?: number | null
          resortId?: number | null
          villaId?: number | null
          checkIn?: string
          checkOut?: string
          guests?: number
          specialRequests?: string | null
          totalPrice?: number
          status?: string
          firstName?: string
          lastName?: string
          email?: string
          phoneNumber?: string
          paymentMethod?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      leads: {
        Row: {
          id: number
          firstName: string
          lastName: string
          email: string
          phone: string
          message: string | null
          source: string
          status: string
          formName: string | null
          submissionId: string
          tags: string[]
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          firstName: string
          lastName: string
          email: string
          phone: string
          message?: string | null
          source: string
          status: string
          formName?: string | null
          submissionId: string
          tags: string[]
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          firstName?: string
          lastName?: string
          email?: string
          phone?: string
          message?: string | null
          source?: string
          status?: string
          formName?: string | null
          submissionId?: string
          tags?: string[]
          createdAt?: string
          updatedAt?: string
        }
      }
      guide_submissions: {
        Row: {
          id: number
          firstName: string
          lastName: string
          email: string
          phone: string
          preferredContactMethod: string
          guideType: string
          source: string
          status: string
          formName: string
          submissionId: string
          tags: string[]
          interestAreas: string[]
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          firstName: string
          lastName: string
          email: string
          phone: string
          preferredContactMethod: string
          guideType: string
          source: string
          status: string
          formName: string
          submissionId: string
          tags: string[]
          interestAreas: string[]
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          firstName?: string
          lastName?: string
          email?: string
          phone?: string
          preferredContactMethod?: string
          guideType?: string
          source?: string
          status?: string
          formName?: string
          submissionId?: string
          tags?: string[]
          interestAreas?: string[]
          createdAt?: string
          updatedAt?: string
        }
      }
    }
    // Add more tables as needed
  }
}