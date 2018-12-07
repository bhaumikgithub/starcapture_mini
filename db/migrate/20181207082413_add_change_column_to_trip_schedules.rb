class AddChangeColumnToTripSchedules < ActiveRecord::Migration[5.2]
  def change
    rename_column :trip_schedules, :time, :start_time
    add_column :trip_schedules, :end_time,:datetime
  end
end
