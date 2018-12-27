class TripsController < ApplicationController
  before_action :authenticate_user!, :except => [:show, :update]
  before_action :find_trip, :only => [:show, :update, :destroy]

  def index
    @trips = current_user.trips
  end

  def new
    @trip = Trip.new
  end

  def show
  end

  def create
    current_user.trips.create(trip_params)
    redirect_to trips_path
  end
  
  def update
    if current_user
      if params[:data]
        params[:data].each do |key , value|
          a = TripSchedule.find_by(id: value)
          a.update(position: key)
        end
      else
        @trip.update(trip_params)
        redirect_to trip_path(@trip)
      end
    else
      redirect_to new_user_registration_path(:sharable => true), notice: "You need to signup."
    end
  end

  def destroy
    @trip.destroy!
    redirect_to trips_path
  end

  private

  def find_trip
    @trip = Trip.find_by(id: params[:id])
  end

  def trip_params
    params.require(:trip).permit(:name, :description,:total_duration, trip_schedules_attributes: [:start_time,:end_time, :place,:distance,:position,:duration,:id,:_destroy])
  end
end
