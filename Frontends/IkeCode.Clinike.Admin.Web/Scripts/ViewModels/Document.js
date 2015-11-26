///<reference path="../typings/jquery/jquery.d.ts" />
///<reference path="../typings/jquery.plugins/jquery.easyui.d.ts" />
///<reference path="../typings/jquery.plugins/jquery.mask.d.ts" />
///<reference path="../typings/bootstrap/bootstrap.d.ts" />
///<reference path="../typings/knockout/knockout.d.ts" />
///<reference path="../typings/knockout.mapping/knockout.mapping.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DocumentModule;
(function (DocumentModule) {
    var KoViewModel = (function (_super) {
        __extends(KoViewModel, _super);
        function KoViewModel(targetSelector, saveCallback) {
            var _this = this;
            _super.call(this);
            this.DocumentTypes = ko.observable();
            this._validationGroup = ko.validatedObservable(this);
            this._validationErrors = ko.validation.group(this);
            this.Init = function () {
                if (_this._targetSelector) {
                    //common.GetJsonEnum('PhoneType'
                    //    , null
                    //    , null
                    //    , (data) => {
                    //        this.PhoneTypes(data);
                    //    });
                    var vm = ko.mapping.fromJS(_this);
                    var target = $(_this._targetSelector).get(0);
                    ko.cleanNode(target);
                    ko.applyBindings(vm, target);
                }
            };
            this.Save = function () {
                var dataJS = _this.toJS();
                if (common.EnableLogGlobal) {
                    console.log('dataJS', dataJS);
                }
                if (!_this._validationGroup.isValid()) {
                    _this._validationErrors.showAllMessages();
                }
                else {
                    $.ajax({
                        url: '/Document/Post',
                        data: dataJS,
                        type: 'POST',
                        dataType: 'json',
                        success: function (data, textStatus, jqXHR) {
                            var oldId = _this.Id;
                            if (common.EnableLogGlobal) {
                                console.log('textStatus', textStatus);
                                console.log('data', data);
                            }
                            _this.Update(data.Record);
                            if (common.EnableLogGlobal) {
                                console.log('this.Id', _this.Id);
                            }
                            _this._saveCallback(oldId, data);
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                }
            };
            if (common.EnableLogGlobal) {
                console.log('Document ctor');
            }
            this._saveCallback = saveCallback;
            if (targetSelector) {
                this._targetSelector = targetSelector;
                $.getJSON('/Document/GetDocumentTypes', function (data, textStatus) {
                    console.log('GetDocumentTypes data', data);
                    if (data) {
                        _this.DocumentTypes(data.Options);
                    }
                });
                this.DocumentTypeId.extend({ required: { params: true, message: '* obrigatório' }, min: { params: -1, message: '* obrigatório' } });
            }
        }
        return KoViewModel;
    })(KoDocument);
    DocumentModule.KoViewModel = KoViewModel;
    var GridViewModel = (function (_super) {
        __extends(GridViewModel, _super);
        function GridViewModel(_parentId) {
            var _this = this;
            _super.call(this);
            this._toolBarSelector = '#documentsToolbar';
            this._gridSelector = '#documentsGrid';
            this._modalSelector = '#documentEditorModal';
            this._parentId = 0;
            this.LoadDataGrid = function (selector) {
                if (selector === void 0) { selector = _this._gridSelector; }
                console.log('Document parentId', _this._parentId);
                $(selector).datagrid({
                    idField: 'Id',
                    toolbar: _this._toolBarSelector,
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
                    onClickRow: function (index, row) {
                        _this.OnClickRow(index, row);
                    },
                    onDblClickRow: function (index, row) {
                        _this.OnClickRow(index, row);
                    },
                    loader: function (param, success, error) {
                        dataGridHelper.Loader('/Document/GetList', { personId: _this._parentId }, success, error, 'GET', true);
                    },
                    onLoadSuccess: function (items) {
                        console.log('document.LoadDataGrid onLoadSuccess items', items);
                        if (common.EnableLogGlobal) {
                            console.log('document.LoadDataGrid onLoadSuccess');
                        }
                        dataGridHelper.CollapseBoxAfterLoad(_this._gridSelector);
                        _this.documentViewModel.Init();
                    }
                });
            };
            console.log('GridViewModel ctor');
            this._parentId = _parentId;
            this.documentViewModel = new DocumentModule.KoViewModel('#documentEditorModal div[data-type="kobind"]', function (oldId, parsedData) {
                $(_this._modalSelector).modal('hide');
                if (oldId > 0) {
                    $(_this._gridSelector).datagrid('updateRow', { index: _this.SelectedIndex, row: parsedData.Record });
                }
                else {
                    $(_this._gridSelector).datagrid('appendRow', parsedData.Record);
                }
            });
            $(this._toolBarSelector).find('button[data-buttontype="add"]').bind('click', function () {
                var newPoco = new PhonePoco();
                newPoco.PersonId = _this._parentId;
                _this.ShowModal(newPoco);
            });
            $(this._toolBarSelector).find('button[data-buttontype="edit"]').bind('click', function () {
                _this.ShowModal(_this.SelectedRow);
            });
            $(this._toolBarSelector).find('button[data-buttontype="delete"]').bind('click', function () {
                _this.Delete();
            });
        }
        GridViewModel.prototype.Delete = function () {
            var _this = this;
            if (common.EnableLogGlobal) {
                console.log('Document Delete');
            }
            confirmModal.Show({
                Title: 'Confirmação',
                Message: 'Deseja realmente excluir o registro selecionado?',
                ConfirmCallback: function () {
                    $.ajax({
                        url: '/Document/Delete',
                        data: { id: _this.SelectedRow.Id },
                        type: 'POST',
                        dataType: 'json',
                        success: function (data, textStatus, jqXHR) {
                            if (common.EnableLogGlobal) {
                                console.log('Delete Success');
                                console.log('data', data);
                                console.log('textStatus', textStatus);
                            }
                            var newPoco = new DocumentPoco();
                            newPoco.PersonId = _this.SelectedRow.PersonId;
                            _this.documentViewModel.Update(newPoco);
                            if (common.EnableLogGlobal) {
                                console.log('this.Id', _this.SelectedRow.Id);
                                console.log('this.SelectedIndex', _this.SelectedIndex);
                            }
                            $(_this._toolBarSelector).find('button[data-buttontype="edit"], button[data-buttontype="delete"]').attr('disabled', 'disabled');
                            $(_this._gridSelector).datagrid('deleteRow', _this.SelectedIndex);
                        },
                        error: function (err) {
                            if (common.EnableLogGlobal) {
                                console.log('Delete Error!', err);
                            }
                        }
                    });
                }
            });
        };
        GridViewModel.prototype.OnClickRow = function (index, row) {
            this.SelectedIndex = index;
            this.SelectedRow = row;
            console.log('Address row', row);
            this.documentViewModel.Update(row);
            $(this._toolBarSelector).find('button[data-buttontype="edit"], button[data-buttontype="delete"]').removeAttr('disabled');
        };
        GridViewModel.prototype.ShowModal = function (objToUpdate) {
            if (common.EnableLogGlobal) {
                console.log('objToUpdate', objToUpdate);
            }
            this.documentViewModel.Update(objToUpdate);
            $(this._modalSelector).modal('show');
        };
        return GridViewModel;
    })(BaseDataGridModel);
    DocumentModule.GridViewModel = GridViewModel;
})(DocumentModule || (DocumentModule = {}));
