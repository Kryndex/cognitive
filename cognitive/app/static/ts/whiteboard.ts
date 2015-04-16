// Will remove these global variables
var _uploaded_file_as_text   = "";
var _uploaded_file_name      = "";
var _uploaded_file_as_arrays = [];

class ViewController {

    static projections: number;
    static remove_duplicates_columns: number;

    static svg_root: any;
    static layer_0: any;
    static scope_layer: any;
    static connection_layer: any;
    static component_layer: any;
    static functionality_layer: any;
    /*
     * TODO: uploaded file related variable should not be global
     */

    //static uploaded_file_as_text   = "";
    //static uploaded_file_name      = "";
    //static uploaded_file_as_arrays = [];

    constructor() {

        ViewController.svg_root = $("#root");
        ViewController.layer_0 = $("#layer-0");
        ViewController.scope_layer = $("#layer-1");
        ViewController.connection_layer = $("#layer-2");
        ViewController.component_layer = $("#layer-3");
        ViewController.functionality_layer = $("#layer-4");

        $(".menu_bar").click(function(){
            if ($(this).hasClass("introduction")){
                ComponentController.activate_menubar('introduction');
            } else if ($(this).hasClass("data_input")) {
                ComponentController.activate_menubar('data_input');
                InputData.add_btn.removeClass("disabled");
                InputData.edit_btn.addClass("disabled");
            } else if ($(this).hasClass("add_row")) {
                ComponentController.activate_menubar("add_row");
                AddRow.generate_detail_view();
                AddRow.add_btn.removeClass("disabled");
                AddRow.edit_btn.addClass("disabled");
            } else if ($(this).hasClass("add_math_fomula")) {
                ComponentController.activate_menubar("add_math_fomula");
                ViewController.description_formula();
                MathFormula.add_btn.removeClass("disabled");
                MathFormula.edit_btn.addClass("disabled");
            } else if ($(this).hasClass("projection")) {
                ComponentController.activate_menubar("projection");
                ViewController.initialize_projection_column();
                ViewController.add_column_for_projection();
                ColumnSelection.add_btn.removeClass("disabled");
                ColumnSelection.edit_btn.addClass("disabled");
            } else if ($(this).hasClass("normalization")) {
                ComponentController.activate_menubar("normalization");
                ViewController.description_normalization();
                Normalization.add_btn.removeClass("disabled");
                Normalization.edit_btn.addClass("disabled");
            } else if ($(this).hasClass("remove_column")) {
                ComponentController.activate_menubar("remove_column");
                ViewController.initialize_remove_duplicates_column();
                ViewController.add_column_for_remove_duplicates();
                RemoveDuplicates.add_btn.removeClass("disabled");
                RemoveDuplicates.edit_btn.addClass("disabled");
            } else if ($(this).hasClass("remove_missing_value")) {
                ComponentController.activate_menubar("remove_missing_value");
                RemoveMissingValues.add_btn.removeClass("disabled");
                RemoveMissingValues.edit_btn.addClass("disabled");
            } else if ($(this).hasClass("transform")) {
                ComponentController.activate_menubar("transform");
                MathFormula.add_btn.removeClass("disabled");
                MathFormula.edit_btn.addClass("disabled");
            } else if ($(this).hasClass("metadata")) {
                ComponentController.activate_menubar("metadata");
                ViewController.description_metadata();
                MetadataEditor.add_btn.removeClass("disabled");
                MetadataEditor.edit_btn.addClass("disabled");
            } else if ($(this).hasClass("machine_learning")) {
                ComponentController.activate_menubar("machine_learning");
                ViewController.description_machine_learning();
                MachineLearning.add_btn.removeClass("disabled");
                MachineLearning.edit_btn.addClass("disabled");
            }
        });

        $(".add_btn").click(function() {

            /*
             * TODO: [refactor] create_component method will be defined in ComponentBase class
             * in create_component method, they call _create method which can be override
             * by sub class.
             */

            if ($(this).hasClass('add_input')) {
                ComponentController.create_input_component();
            } else if ($(this).hasClass('add_row')) {
                ComponentController.create_add_row_component();
            } else if ($(this).hasClass('add_math_fomula')) {
                ComponentController.create_math_formula_component();
            } else if ($(this).hasClass('add_normalization')) {
                ComponentController.create_normalization_component();
            } else if ($(this).hasClass('add_projection')) {
                ComponentController.create_projection_component();
            } else if ($(this).hasClass('add_remove_duplicates')) {
                ComponentController.create_remove_duplicates_component();
            } else if ($(this).hasClass('add_remove_missing_value')) {
                ComponentController.create_remove_missing_value_component();
            } else if ($(this).hasClass('add_metadata')) {
                ComponentController.create_metadata_component();
            } else if ($(this).hasClass('add_machine_learning')) {
                ComponentController.create_machine_learning_component();
            }
        });

        $("#execute-btn").click(function () {
            ViewController.run();
        });

        $('.projection.plus-bottom').click(ViewController.add_column_for_projection);
        $('.remove_duplicates.plus-bottom').click(ViewController.add_column_for_remove_duplicates);

        $('#inputFile').change(function(evt) {
            var file = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                _uploaded_file_as_text = e.target.result;
                _uploaded_file_as_arrays = $.csv.toArrays(_uploaded_file_as_text);
            };
            reader.readAsText(file);

            _uploaded_file_name = file.name
        });

        var t = document.getElementById('root');
        var root_drag_frag;
        var root_drag_frag_reverse;
        var drag_start_x: number;
        var drag_start_y: number;
        var current_line_id: number;
        var previous_line_id: number;

        t.addEventListener('mousedown', function (e) {
            root_drag_frag = 0;
            root_drag_frag_reverse = 1;
            drag_start_x = e.x;
            drag_start_y = e.y;
            previous_line_id = 0;
            current_line_id = 1;
        }, false);

        t.addEventListener('mousemove', function (e) {
            root_drag_frag = 1;
            /*
             * [WIP] mouse drag should eneble to select some areas.
             */
            if (root_drag_frag_reverse === 1) {
                console.log(e.x, " ", e.y);
                var func_lay = d3.selectAll(ViewController.functionality_layer);
                func_lay.append("rect")
                    .attr("class", "mouse-select-range")
                    .attr("id", "mouse-select-range-" + current_line_id)
                    .attr("x", drag_start_x - 280).attr("y", drag_start_y - 45)
                    .attr("width", e.x - drag_start_x).attr("height", e.y - drag_start_y)
                    .attr('stroke', "steelblue" ).attr('stroke-width', "1")
                    .attr('fill', 'none');
            }
            $("#mouse-select-range-" + previous_line_id).remove();
            previous_line_id = current_line_id;
        }, false);

        t.addEventListener('mouseup', function () {
            // this is click
            if (root_drag_frag === 0) {
                ComponentController.deacitive_menubar();
                ComponentController.deactivate_focus();
            }
            root_drag_frag = 0;
            root_drag_frag_reverse = 0;
            $("#mouse-select-range-" + previous_line_id).remove();
        }, false);
    }

    static initialize_projection_column(): void {
        $('.form-group.projection_form').empty();
        ViewController.projections = 0;
    }

    static add_column_for_projection(): void {
        if (_uploaded_file_as_text == ""){ return; }
        var column_names = _uploaded_file_as_arrays[0];
        var option_string = "";
        for (var i=0; i < column_names.length; i++ ){
            option_string += '<option value="'+i+'">'+ column_names[i] +'</option>'
        }
        $('.form-group.projection_form').append(
            '<select class="form-control projection_selects _selects_'
            +ViewController.projections+'">'+option_string+'</select>'
        );

        ViewController.projections++;
    }

    static initialize_remove_duplicates_column():void {
        $('.form-group.remove_duplicates_form').empty();
        ViewController.remove_duplicates_columns = 0;
    }

    static add_column_for_remove_duplicates(): void {
        if (_uploaded_file_as_text == ""){ return;}
        var column_names = _uploaded_file_as_arrays[0];
        var option_string = "";
        for (var i=0; i < column_names.length; i++ ){
            option_string += '<option value="'+i+'">'+ column_names[i] +'</option>'
        }
        $('.form-group.remove_duplicates_form').append(
            '<select class="form-control remove_duplicates_selects _selects_'
            +ViewController.remove_duplicates_columns+'">'+option_string+'</select>'
        );

        ViewController.remove_duplicates_columns++;
    }

    static run(): void {

        var start: InputData;

        for (var i: number = 0; i < ComponentBase.component_list.length; i++) {
            if (ComponentBase.component_list[i].name == "Input Data") {
                start = ComponentBase.component_list[i];
            }
        }

        var node_list = ComponentBase.get_workflow_from(start.get_id());

        if (node_list.length < 1) {
            alert("no workflow or input files");
            return;
        }

        var components_id_list = node_list.map(function (n) {
            return n.get_backend_id();
        });

        var flow_path = function (x) {
            var t = "";
            for (var i = 0; i < x.length - 1; i++) {
                t += x[i] + ":" + x[i + 1] + ",";
            }
            return t.substr(0, t.length - 1);
        }(components_id_list);

        $.ajax({
            url: '/api/v1/workflows/',
            type: "POST", data: {
                user_id: 1,
                experiment: 1,
                graph_data: flow_path
            },
            success: function (result) {
                console.log(result);
            }
        });

        $.colorbox({
            html: "<img src='/static/img/spinner.gif' alt='Smiley face' height='200px' width='200px'/>",
            closeButton: false,
            transition: "none",
            opacity: 0,
            arrowKey: false,
            overlayClose: false,
            fastIframe: false,
            width: "300px",
            height: "300px"
        });
        $('#cboxClose').remove();
        $('#cboxTopLeft').remove();
        $('#cboxTopCenter').remove();
        $('#cboxTopRight').remove();
        $('#cboxMiddleLeft').remove();
        $('#cboxMiddleRight').remove();
        $('#cboxBottomCenter').remove();
        $('#cboxBottomLeft').remove();
        $('#cboxBottomRight').remove();
        setTimeout("$.colorbox.close()", 700);
    }

    static description_addrow(): void {
        $(".add_row_form").empty();
        _uploaded_file_as_arrays[0];
        console.log(_uploaded_file_as_arrays[0]);
        if (_uploaded_file_as_text == "") { return; }
        for (var i = 0; i < _uploaded_file_as_arrays[0].length; i++) {
            $(".add_row_form").append('<li class="add_row column_' + i + '" style="padding-top: 10px"></li>');
            $(".add_row_form li.column_" + i).append('<p>' + _uploaded_file_as_arrays[0][i] + '<p/>');
            $("<input/>", {
                "class": "add_row form-control floating-label" + " _column_" + i,
                id: "_column_" + i,
                type: "text",
                placeholder: "value"
            }).appendTo(".add_row_form li.column_" + i);
        }
    }

    static description_formula(): void {
        $("#formula_column").empty();
        if (_uploaded_file_as_text == "") { return; }
        for (var i = 0; i < _uploaded_file_as_arrays[0].length; i++) {
            $("#formula_column").append('<option value="' + i + '">' + _uploaded_file_as_arrays[0][i] + '</option>');
        }
    }

    static description_normalization(): void {
        $("#normalization_column").empty();
        if (_uploaded_file_as_text == "") { return; }
        for (var i = 0; i < _uploaded_file_as_arrays[0].length; i++) {
            $("#normalization_column").append('<option value="' + i + '">' + _uploaded_file_as_arrays[0][i] + '</option>');
        }
    }

    static description_machine_learning(): void {
        $('.machine_learning_target').empty();
        if (_uploaded_file_as_text == "") { return; }
        for (var i = 0; i < _uploaded_file_as_arrays[0].length; i++) {
            $('.machine_learning_target').append('<option value="' + i + '">' + _uploaded_file_as_arrays[0][i] + '</option>');
        }
    }

    static description_metadata(): void {
        $("#metadata_discriptions").empty();
        if (_uploaded_file_as_text == "") { return; }
        for (var i = 0; i < _uploaded_file_as_arrays[0].length; i++) {
            $("#metadata_discriptions").append('<div class="row meta_' + i + '" style="padding-top:25px;"></div>');
            $("#metadata_discriptions div.meta_" + i).append('<p>' + _uploaded_file_as_arrays[0][i] + '</p>');
            $("#metadata_discriptions div.meta_" + i)
                .append('<select class="form-control metadata column' + i + '" id="formula_method select"><option>string</option><option>integer</option><option>categorical</option></select>');
        }
    }
}

class ComponentController {

    static active_menu;

    constructor(){
        ComponentController.active_menu = null;
    }

    static activate_menubar(elm): void {
        this._activate_menubar(elm);
    }

    static deacitive_menubar(): void {
        if (ComponentController._active_menu !== null) {
            var previous_menubar = $('li.'+ this._active_menu);
            var previous_description = $('.detail.'+ this._active_menu);
            previous_description.toggle("slide");
            previous_menubar
                .css("background-color", "")
                .css("color", "").removeClass("active");
            ComponentController._active_menu = null;
        }
    }

    static _activate_menubar(elm): void {
        menubar = $('li.'+elm);
        description = $('.detail.'+elm);

        menubar
            .css("background-color", "#1e8cff")
            .css("color", "white");

        description.toggle("slide", {direction: "left"}, 700);

        if (this._active_menu === null) {
            this._active_menu = elm;
            return(menubar.addClass("active"));
        }

        if (this._active_menu == elm) {
            if (menubar.hasClass("active")) {
                this._active_menu = null;
                return menubar
                    .css("background-color", "")
                    .css("color", "")
                    .removeClass("active");
            }
        }

        previous_menubar = $('li.'+ this._active_menu);
        previous_description = $('.detail.'+ this._active_menu);

        previous_description.toggle("slide");
        previous_menubar
            .css("background-color", "")
            .css("color", "")
            .removeClass("active");

        this._active_menu = elm;

        return(menubar.addClass("active"));
    }

    static deactivate_focus(): void {
        if (ComponentBase.current_focus === null) {return;}
        ComponentBase.current_focus.classed("clicked", false);
        ComponentBase.current_focus = null;
    }

    static create_input_component(): void {
        var node = new InputData();
        var params: InputDataComponentCreateParams = {
            file_name: _uploaded_file_name,
            text_data: _uploaded_file_as_text
        };

        node.create_request(params);
    }

    static create_add_row_component(): void {
        var node = new AddRow();
        var request_text = "[";
        for (var i = 0; i < _uploaded_file_as_arrays[0].length; i++) {
            request_text += "\"" + $(".add_row._column_" + i).val() + "\",";
        }

        request_text = request_text.slice(0, request_text.length - 1);
        request_text += "]";

        var params: AddRowComponentCreateParams = {
            values: request_text
        };

        node.create_request(params)
    }

    static create_math_formula_component(): void {
        var node = new MathFormula();
        var method = $('select#formula_method').val();
        var column_num = $('select#formula_column').val();
        var constant = $('#formula_constant').val();

        var params: MathFormulaComponentCreateParams = {
            component_type: "Column",
            component_id: column_num, // should be index number
            op_type: method, // or Sub, Mul, Div
            op_constant: constant
        };

        node.create_request(params)
    }

    static create_normalization_component(): void {
        var node = new Normalization();
        var method = $('select#normalization_method').val();
        var column_num = $('select#normalization_column').val();
        var params: NormalizationComponentCreateParams = {
            component_type: "Column",
            component_id: column_num,
            op_type: method
        };

        node.create_request(params);
    }

    static create_projection_component(): void {
        /* TODO: [refactor] projection to column_selection */
        var node = new ColumnSelection();
        var len = $('.projection_selects').length;
        var projection_columns = "[";

        for (var i = 0; i < len; i++) {
            console.log($('.projection_selects._selects_' + i).val());
            projection_columns += $('.projection_selects._selects_' + i).val() + ","
        }

        projection_columns = projection_columns.slice(0, projection_columns.length - 1);
        projection_columns += "]";

        var params: ColumnSelection = {
            component_id: projection_columns
        };

        node.create_request(params);
    }

    static create_remove_duplicates_component(): void {
        var node = new RemoveDuplicates();
        var len = $('.remove_duplicates_selects').length;
        var remove_duplicates_columns = "[";

        for (var i = 0; i < len; i++) {
            console.log($('.remove_duplicates_selects._selects_' + i).val());
            remove_duplicates_columns += $('.remove_duplicates_selects._selects_' + i).val() + ","
        }
        remove_duplicates_columns = remove_duplicates_columns.slice(0, remove_duplicates_columns.length - 1);
        remove_duplicates_columns += "]";

        RemoveDuplicatesComponentCreateParams = {
            component_id: remove_duplicates_columns
        };

        node.create_request(params);
    }

    static create_remove_missing_value_component(): void {
        var node = new RemoveMissingValues();
        var method = $('#remove_missing_value_method').val();
        var params: RemoveMissingValuesComponentCreateParams = {
            op_action: method //"Replace_mean" or Drop_row
        };

        node.create_request(params);
    }

    static create_metadata_component(): void {
        var node = new MetadataEditor();
        var metadata_types = "[";
        for (var i = 0; i < _uploaded_file_as_arrays[0].length; i++) {
            console.log($(".metadata.column" + i).val());
            metadata_types += "\"" + $(".metadata.column" + i).val() + "\",";
        }
        metadata_types = metadata_types.slice(0, metadata_types.length - 1);
        metadata_types += "]";

        var params: MetadataEditorComponentCreateParams = {
            column_type: metadata_types
        };

        node.create_request(params);
    }

    static create_machine_learning_component(): void {
        var node = new MachineLearning();
        var argo = $('.machine_learning_select').val();
        var target = $('.machine_learning_target').val();
        var parcentage = $('.machine_learning_target_parcentage').val();
        var params: MachineLearningComponentCreateParams = {
            model_type: argo,
            train_data_percentage: parcentage,
            target_column: target
        };

        node.create_request(params);
    }
}

var Manager = new ComponentController();

$(function(){

    var m = Manager;
    var svg = d3.selectAll("svg");
    var t = new ViewController();

    /*
     * TODO: getting results and rendering results should be implemented
     *       into Component Class and ViewController Class...(?)
     *       1) show should be implemented into VC
     *       2) the differences are implemented into Component
     */

    $(".show_result_graph").click(getResult);

    function getResult() {

        var component = ComponentBase.get_current_focus_component();
        if (component == null) {return;}

        $.ajax({
            url:  '/api/v1/results/?experiment=1&component_id=' + component.get_backend_id(),
            type: "GET",
            data: "",
            success: function(result) {
                a = result;
                console.log(result);
                var z = serialize_result_to_html(result);

                $.colorbox({html:"<h1><i class='fa.fa-bar-chart'></i> Results</h1><p>"+z+"</p>", width: "90%"});

                render_result_graphs(result);
            }
        });
    }

    function render_result_graphs(result) {
        var w = 100;
        var h = 100;

        for (var i=0; i < result['feature_names'].length; i++ ){
            var target_area = d3.select("svg[class='graph column_"+i+"']");
            var dataset = result.graph_data[i][1];

            if (d3.max(dataset) == d3.min(dataset)) {
                dataset = [100,100,100,100];
            }

            for (var j=0; j < dataset.length; j++) {
                if (dataset[j] >= 96) {
                    dataset[j] -= 4;
                }
            }

            if (dataset.length == 3){
                dataset.push(0);
            } else if (dataset.length == 2) {
                var _t = [0];
                _t.push(dataset[0]);
                _t.push(0);
                _t.push(dataset[1]);
                dataset = _t;
            } else if (dataset.length == 1) {
                var _t = [0];
                _t.push(dataset[0]);
                _t.push(0);
                _t.push(0);
                dataset = _t;
            }

            var svg = d3.select("svg[class='graph column_"+i+"']");

            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("x", function(d,i){ return i * 22 + 7; })
                .attr("y", function(d){ return h - d; })
                .attr('class', 'bar')
                .attr('height', function(d){ return d -4; })
                .attr("width", (w/dataset.length - 6));

            svg.append('rect')
                .attr("x", 3)
                .attr("y", 3)
                .attr('width',  w - 6 )
                .attr('height', h - 6 )
                .attr('stroke', "black" )
                .attr('fill', 'none')
                .attr('stroke-width', "1" )
        }
    }

    function serialize_result_to_html(result) {

        var _html ="<div id='result_wrapper'>";

        if (Object.keys(result).indexOf('output') >= 0) {
            _html += "<h2 style='border-left: solid 35px midnightblue;padding-left: 8px;'>Model Evaluation</h2>";
            _html += "<table class='result_table machine_learning_result'>";

            var ml_output = result['output'];
            var keys = Object.keys(ml_output);

            _html += "<tr class='metrics'>";
            for (var i=0; i<keys.length; i++) {
                _html += "<th>"+keys[i]+"</th>"
            }
            _html += "</tr><tr>";
            for (var i=0; i<keys.length; i++) {
                _html += "<th>"+ml_output[keys[i]]+"</th>"
            }
            _html += "</tr></table>"
        }

        _html += "<h2 style='border-left: solid 35px midnightblue;padding-left: 8px;'></i>Statistics</h2>";
        _html += "<table class='result_table'>";

        _html +="<tr><th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>";

        for (var i=0; i < result['feature_names'].length; i++ ){
            _html += "<th><svg class='graph column_"+i+"'></svg></th>"
        }
        _html +="</tr>";

        _html += '<tr class="metrics">';
        _html +="<th>Statistics</th>";
        for (var i=0; i < result['feature_names'].length; i++ ){
            _html += "<th>" + result['feature_names'][i] + "</th>"
        }
        _html += "</tr>";

        _html += "<tr class='result_row static_results'>";
        _html +="<th>Std Deviation</th>";
        for (var i=0; i < result['std'].length; i++ ){
            _html += "<th>" + result['std'][i] + "</th>"
        }
        _html += "</tr><tr class='result_row static_results'>";

        _html +="<th>75 Quartile</th>";
        for (var i=0; i < result['75_quartile'].length; i++ ){
            _html += "<th>" + result['75_quartile'][i] + "</th>"
        }
        _html += "</tr><tr class='result_row static_results'>";

        _html +="<th>50 Quartile</th>";
        for (var i=0; i < result['50_quartile'].length; i++ ){
            _html += "<th>" + result['50_quartile'][i] + "</th>"
        }
        _html += "</tr><tr class='result_row static_results'>";

        _html +="<th>25 Quartile</th>";
        for (var i=0; i < result['25_quartile'].length; i++ ){
            _html += "<th>" + result['25_quartile'][i] + "</th>"
        }

        _html += "</tr><tr class='result_row static_results'>";

        _html +="<th>Max</th>";
        for (var i=0; i < result['max'].length; i++ ){
            _html += "<th>" + result['max'][i] + "</th>"
        }
        _html += "</tr><tr class='result_row static_results'>";

        _html +="<th>Mean</th>";
        for (var i=0; i < result['mean'].length; i++ ){
            _html += "<th>" + result['mean'][i] + "</th>"
        }
        _html += "</tr><tr class='result_row static_results'>";

        _html +="<th>Median</th>";
        for (var i=0; i < result['median'].length; i++ ){
            _html += "<th>" + result['median'][i] + "</th>"
        }
        _html += "</tr><tr class='result_row static_results'>";

        _html +="<th>Min</th>";
        for (var i=0; i < result['min'].length; i++ ){
            _html += "<th>" + result['min'][i] + "</th>"
        }
        _html += "</tr><tr class='result_row static_results'>";

        _html +="<th>Missing Values</th>";
        for (var i=0; i < result['missing_values'].length; i++ ){
            _html += "<th>" + result['missing_values'][i] + "</th>"
        }
        _html += "</tr><tr class='result_row static_results'>";

        _html +="<th>Unique Values</th>";
        for (var i=0; i < result['unique_values'].length; i++ ){
            _html += "<th>" + result['unique_values'][i] + "</th>"
        }

        _html += "</tr><tr class='metrics static_results'><td></td>";
        for (var i=0; i < result['feature_names'].length; i++ ){
            _html += "<th>" + result['feature_names'][i] + "</th>"
        }
        _html += "</tr>";

        for (var i=0; i < result['data'].length; i++ ){
            _html +="<tr class='result_row'><th></th>";
            for (var j=0; j < result['data'][i].length; j++ ){
                _html += "<th>" + result['data'][i][j] + "</th>"
            }
            _html +="</tr>"
        }
        _html += "</table></div>";

        return _html;
    }
});