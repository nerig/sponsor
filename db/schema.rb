# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150205162453) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "events", force: true do |t|
    t.string   "name"
    t.text     "address1"
    t.text     "address2"
    t.string   "city"
    t.string   "region"
    t.string   "country"
    t.string   "contact_number"
    t.text     "description"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "size_range"
    t.text     "sponsorship_requests"
    t.string   "recurrence"
    t.string   "attendees_gender"
    t.string   "image_url"
    t.text     "sponsorship_types"
    t.text     "attendees_income_levels"
    t.text     "age_ranges"
    t.string   "zipcode"
    t.integer  "total_amount"
    t.integer  "min_amount"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.datetime "date_time_starts"
    t.datetime "date_time_ends"
    t.string   "identifier"
  end

  add_index "events", ["identifier"], name: "index_events_on_identifier", unique: true, using: :btree
  add_index "events", ["user_id"], name: "index_events_on_user_id", using: :btree

  create_table "sponsorship_responses", force: true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "phone_number"
    t.string   "company_name"
    t.string   "title"
    t.text     "offered_sponsorship"
    t.text     "comments"
    t.integer  "event_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "amount"
  end

  add_index "sponsorship_responses", ["event_id"], name: "index_sponsorship_responses_on_event_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "phone"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
