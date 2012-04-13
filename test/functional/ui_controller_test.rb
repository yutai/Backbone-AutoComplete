require 'test_helper'

class UiControllerTest < ActionController::TestCase
  test "should get create_variations" do
    get :create_variations
    assert_response :success
  end

  test "should get otex" do
    get :otex
    assert_response :success
  end

  test "should get initalize_banner" do
    get :initalize_banner
    assert_response :success
  end

  test "should get banner_details" do
    get :banner_details
    assert_response :success
  end

end
