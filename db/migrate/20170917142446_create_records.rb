class CreateRecords < ActiveRecord::Migration
  def change
    create_table :records do |t|
      t.string :from
      t.string :to
      t.string :depart_date
      t.string :return_date
      t.string :adults
      t.string :childrens
      t.timestamps
    end
  end
end
