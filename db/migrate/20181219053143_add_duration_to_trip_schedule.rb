class AddDurationToTripSchedule < ActiveRecord::Migration[5.2]
  def change
    add_column :trip_schedules, :duration, :datetime
  end
end
