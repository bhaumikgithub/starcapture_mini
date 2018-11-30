class CreateTripSchedules < ActiveRecord::Migration[5.2]
  def change
    create_table :trip_schedules do |t|
      t.datetime :time
      t.text :place
      t.float :distance
      t.integer :position
      t.references :trip, foreign_key: true

      t.timestamps
    end
  end
end
