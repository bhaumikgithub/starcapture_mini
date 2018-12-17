class AddTotalDurationToTrips < ActiveRecord::Migration[5.2]
  def change
    add_column :trips, :total_duration, :string
  end
end
