//function Documents() {
//    var self = this;
//    self.LoadDataGrid = function (selector) {
//        $(selector).datagrid({
//            idField: 'Id'
//            , toolbar: '#documentsToolbar'
//            , rownumbers: true
//            , pagination: true
//            , singleSelect: true
//            , striped: true
//            , loadMsg: dataGridHelper.LoadMessage
//            , columns: [[
//                { field: 'Id', hidden: true }
//                , { field: 'PersonId', hidden: true }
//                , { field: 'DateIns', hidden: true }
//                , { field: 'LastUpdate', hidden: true }
//                , { field: 'DocumentTypeId', hidden: true }
//                , { field: 'Value', title: 'Valor', width: 200 }
//                , {
//                    field: 'DocumentType'
//                    , title: 'Tipo'
//                    , width: 200
//                    , formatter: function (value, row, index) {
//                        return value.Name;
//                    }
//                }
//            ]]
//            , onLoadSuccess: function (items) {
//                dataGridHelper.CollapseBoxAfterLoad(this);
//            }
//            , loader: function (param, success, error) {
//                dataGridHelper.Loader('/Person/GetDocuments', { personId: person.Id }, success, error);
//            }
//        });
//    }
//}
//var documents = new Documents();
"use strict";
var Documents = (function () {
    function Documents() {
    }
    Documents.prototype.LoadDataGrid = function (selector) {
        $(selector).datagrid({
            idField: 'Id',
            toolbar: '#documentsToolbar',
            rownumbers: true,
            pagination: true,
            singleSelect: true,
            striped: true,
            loadMsg: dataGridHelper.LoadMessage,
            columns: [[
                    { field: 'Id', hidden: true },
                    { field: 'PersonId', hidden: true },
                    { field: 'DateIns', hidden: true },
                    { field: 'LastUpdate', hidden: true },
                    { field: 'DocumentTypeId', hidden: true },
                    { field: 'Value', title: 'Valor', width: 200 },
                    {
                        field: 'DocumentType',
                        title: 'Tipo',
                        width: 200,
                        formatter: function (value, row, index) {
                            return value.Name;
                        }
                    }
                ]],
            onLoadSuccess: function (items) {
                dataGridHelper.CollapseBoxAfterLoad(this);
            },
            loader: function (param, success, error) {
                dataGridHelper.Loader('/Person/GetDocuments', { personId: person.Id }, success, error);
            }
        });
    };
    return Documents;
})();
var documents = new Documents();
