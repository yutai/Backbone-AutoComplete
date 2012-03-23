class SourceSegmentsController < ApplicationController
  # GET /source_segments
  # GET /source_segments.json
  def index
    @source_segments = SourceSegment.search(params[:search]).paginate(:per_page => params[:per_page], :page => params[:page])

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @source_segments }
    end
  end

  # GET /source_segments/1
  # GET /source_segments/1.json
  def show
    @source_segment = SourceSegment.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @source_segment }
    end
  end

  # GET /source_segments/new
  # GET /source_segments/new.json
  def new
    @source_segment = SourceSegment.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render :json => @source_segment }
    end
  end

  # GET /source_segments/1/edit
  def edit
    @source_segment = SourceSegment.find(params[:id])
  end

  # POST /source_segments
  # POST /source_segments.json
  def create
    @source_segment = SourceSegment.new(params[:source_segment])

    respond_to do |format|
      if @source_segment.save
        format.html { redirect_to @source_segment, :notice => 'Source segment was successfully created.' }
        format.json { render :json => @source_segment, :status => :created, :location => @source_segment }
      else
        format.html { render :action => "new" }
        format.json { render :json => @source_segment.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /source_segments/1
  # PUT /source_segments/1.json
  def update
    @source_segment = SourceSegment.find(params[:id])

    respond_to do |format|
      if @source_segment.update_attributes(params[:source_segment])
        format.html { redirect_to @source_segment, :notice => 'Source segment was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render :action => "edit" }
        format.json { render :json => @source_segment.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /source_segments/1
  # DELETE /source_segments/1.json
  def destroy
    @source_segment = SourceSegment.find(params[:id])
    @source_segment.destroy

    respond_to do |format|
      format.html { redirect_to source_segments_url }
      format.json { head :no_content }
    end
  end
end
