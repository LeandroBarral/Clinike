﻿///<reference path="../typings/jquery/jquery.d.ts" />
///<reference path="../typings/jquery.plugins/jquery.easyui.d.ts" />
///<reference path="../typings/jquery.plugins/jquery.mask.d.ts" />
///<reference path="../typings/knockout/knockout.d.ts" />
///<reference path="../typings/knockout.mapping/knockout.mapping.d.ts" />

"use strict";
class PhoneViewModel {
    constructor(initialData: any) {
        if (common.EnableLogGlobal) {
            console.log('PhoneViewModel constructor');
        }

        ko.mapping.fromJS(initialData, {}, this);

        if (common.EnableLogGlobal) {
            console.log('PhoneViewModel initialData', initialData);
        }
    }

    public Save(): void {
        var data = ko.mapping.toJSON(this);

        if (common.EnableLogGlobal) {
            console.log('ko.mapping.toJSON(this)', data);
        }

        $.ajax({
            url: '/Phone/PostPhone'
            , data: data
            , type: 'POST'
            , contentType: 'application/json'
            , success: function (data, textStatus, jqXHR) {
                if (common.EnableLogGlobal) {
                    console.log('textStatus', textStatus);
                    console.log('data', data);
                }
            }
            , error: function () {
                if (common.EnableLogGlobal) {
                    console.log('error');
                }
            }
        });
    }
}

class Phone {
    SelectedIndex = -1;

    public LoadDataGrid(selector: string) {
        console.log('phone.LoadDataGrid');
        $(selector).datagrid({
            idField: 'Id'
            , toolbar: '#phonesToolbar'
            , rownumbers: true
            , pagination: true
            , singleSelect: true
            , striped: true
            , loadMsg: dataGridHelper.LoadMessage
            , columns: [[
                { field: 'Id', title: 'Id', hidden: true }
                , { field: 'PersonId', title: 'PersonId', hidden: true }
                , { field: 'DateIns', title: 'DateIns', hidden: true }
                , { field: 'LastUpdate', title: 'LastUpdate', hidden: true }
                , {
                    field: 'Number'
                    , title: 'Número'
                    , width: 200
                    , formatter: function (value, row, index) {
                        return '<span name="spanNumber">' + value + '</span>';
                    }
                }
                , { field: 'PhoneType', title: 'Tipo', width: 200 }
            ]]
            , onLoadSuccess: function (items) {
                dataGridHelper.CollapseBoxAfterLoad(this);
                $('[name="spanNumber"]').mask('(00) 00000-0000');
            }
            , onClickRow: function (index, row) {
                phone.OnClickRow(index, row);
            }
            , onDblClickRow: function (index, row) {
                phone.OnClickRow(index, row);
            }
            , loader: function (param, success, error) {
                dataGridHelper.Loader('/Phone/GetPhones', { personId: person.Id }, success, error);
            }
        });
    }

    private OnClickRow(index, row) {
        this.SelectedIndex = index;
        dataGridHelper.OnClickRow(index, row, '#phonesToolbar');

        var model = new PhoneViewModel(row);
        ko.applyBindings(model, $('#phoneEditorModal').get(0));
    }

    public Edit() {
        var selectedRow = $('#phonesGrid').datagrid('getSelected');

        if (common.EnableLogGlobal) {
            console.log('phone.Edit selectedRow', selectedRow);
            console.log('phone.Edit selectedRow.Id', selectedRow.Id);
        }

        if (this.SelectedIndex > -1) {
            $('#phoneEditorModal').modal('show');
            $('#phonesGrid').datagrid('updateRow', { index: this.SelectedIndex, row: selectedRow });
        }
    }

    public Save() {
        var selectedRow = $('#phonesGrid').datagrid('getSelected');

        if (common.EnableLogGlobal) {
            console.log('phone.Edit selectedRow', selectedRow);
            console.log('phone.Edit selectedRow.Id', selectedRow.Id);
        }

        if (this.SelectedIndex > -1) {
            $('#phonesGrid').datagrid('updateRow', { index: this.SelectedIndex, row: selectedRow });
        }
    }

    public Delete() {
        var selectedRow = $('#phonesGrid').datagrid('getSelected');

        if (common.EnableLogGlobal) {
            console.log('phone.Delete selectedRow', selectedRow);
            console.log('phone.Delete selectedRow.Id', selectedRow.Id);
        }

        if (this.SelectedIndex > -1) {
            $('#phonesGrid').datagrid('deleteRow', this.SelectedIndex);
        }
    }
}

var phone = new Phone();