class Trip < ApplicationRecord
  has_many :trip_schedules
  accepts_nested_attributes_for :trip_schedules, allow_destroy: true
  belongs_to :user
end
