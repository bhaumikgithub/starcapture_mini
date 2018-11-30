class TripsController < ApplicationController
  before_action :authenticate_user!, :except => [:show, :update]

  def index
    @trips = current_user.trips
  end

  def new
    @trip = Trip.new
  end

  def show
    @trip = Trip.find_by(id: params[:id])
  end

  def create
    current_user.trips.create(trip_params)
    redirect_to trips_path
  end
  
  def update
    if current_user
      @trip = Trip.find_by(id: params[:id])
      if params[:data]
        params[:data].each do |key , value|
          a = TripSchedule.find_by(id: value)
          a.update(position: key)
        end
      else
        @trip.update(trip_params)
        redirect_to trips_path
      end
    else
      redirect_to new_user_registration_path, notice: "You need to signup."
    end
  end

  private

  def trip_params
    params.require(:trip).permit(:name, :description,trip_schedules_attributes: [:time,:place,:distance,:position,:id,:_destroy])
  end
end
