var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MachineLearning = (function (_super) {
    __extends(MachineLearning, _super);
    function MachineLearning() {
        _super.call(this, {
            "name": "Machine Learning",
            "width": 0,
            "height": 0,
            "input": 1,
            "output": 1
        });
    }
    MachineLearning.prototype.create_request = function (params) {
        this.model_type = params.model_type;
        this.train_data_percentage = params.train_data_percentage;
        this.target_column = params.target_column;
        var json_data = {
            model_type: params.model_type,
            train_data_percentage: params.train_data_percentage,
            target_column: params.target_column
        };
        var api_url = '/api/v1' + '/operations/machine_learning/';
        ComponentBase._send_request(api_url, "POST", json_data, this);
    };
    MachineLearning.prototype.put_request = function (params) {
        this.model_type = params.model_type;
        this.train_data_percentage = params.train_data_percentage;
        this.target_column = params.target_column;
        var json_data = {
            model_type: params.model_type,
            train_data_percentage: params.train_data_percentage,
            target_column: params.target_column
        };
        var api_url = '/api/v1' + '/operations/machine_learning/' + this.get_backend_id();
        ComponentBase._send_request(api_url, "PUT", json_data, this);
    };
    MachineLearning.prototype.delete_request = function () {
        var api_url = '/api/v1' + '/operations/machine_learning/' + this.get_backend_id();
        ComponentBase._send_request(api_url, "DELETE", {}, null);
    };
    MachineLearning.prototype.click_edit = function (e) {
    };
    return MachineLearning;
})(ComponentBase);
//# sourceMappingURL=machine_learning.js.map