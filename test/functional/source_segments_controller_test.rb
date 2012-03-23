require 'test_helper'

class SourceSegmentsControllerTest < ActionController::TestCase
  setup do
    @source_segment = source_segments(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:source_segments)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create source_segment" do
    assert_difference('SourceSegment.count') do
      post :create, :source_segment => @source_segment.attributes
    end

    assert_redirected_to source_segment_path(assigns(:source_segment))
  end

  test "should show source_segment" do
    get :show, :id => @source_segment
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @source_segment
    assert_response :success
  end

  test "should update source_segment" do
    put :update, :id => @source_segment, :source_segment => @source_segment.attributes
    assert_redirected_to source_segment_path(assigns(:source_segment))
  end

  test "should destroy source_segment" do
    assert_difference('SourceSegment.count', -1) do
      delete :destroy, :id => @source_segment
    end

    assert_redirected_to source_segments_path
  end
end
