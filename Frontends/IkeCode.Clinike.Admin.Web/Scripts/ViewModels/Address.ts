﻿"use strict";
class AddressViewModel extends BaseViewModel {

    AddressTypes = ko.observableArray();

    PersonId = ko.observable();
    Street = ko.observable();
    Number = ko.observable();
    Neighborhood = ko.observable();
    State = ko.observable();
    City = ko.observable();
    ZipCode = ko.observable();
    Complement = ko.observable();
    AddressType = ko.observable();
    AddressTypeId = ko.observable();

    constructor() {
        super();

        this.AddressTypes(enumCache.Get("AddressType"));
    }

    private SetData(initialData: any): void {
        var target = $(address._modalSelector).find('div[data-type="kobind"]').get(0);
        ko.cleanNode(target);

        this.AddressTypes(enumCache.Get("AddressType"));

        ko.applyBindings(initialData, target);
    }

    public RefreshData(initialData: any): void {
        if (common.EnableLogGlobal) {
            console.log('AddressViewModel initialData', initialData);
        }

        ko.mapping.fromJS(initialData, {}, this);

        this.SetData(this);
    }

    public ClearData() {
        var target = $(address._modalSelector).find('div[data-type="kobind"]').get(0);
        ko.cleanNode(target);
        ko.applyBindings(new AddressViewModel(), target);
    }

    public Save(): void {
        var data = ko.mapping.toJSON(this);

        if (common.EnableLogGlobal) {
            console.log('ko.mapping.toJSON(this)', data);
        }

        //$.ajax({
        //    url: '/Address/Post'
        //    , data: data
        //    , type: 'POST'
        //    , contentType: 'application/json'
        //    , success: function (data, textStatus, jqXHR) {
        //        if (common.EnableLogGlobal) {
        //            console.log('textStatus', textStatus);
        //            console.log('data', data);
        //        }
        //    }
        //    , error: function () {
        //        if (common.EnableLogGlobal) {
        //            console.log('error');
        //        }
        //    }
        //});
    }
}

class Address extends BaseDataGridModel implements IDataGridModel {
    _toolBarSelector: string = '#addressesToolbar';
    _gridSelector: string = '#addressesGrid';
    _modalSelector: string = '#addressEditorModal';
    addressViewModel: AddressViewModel;

    constructor() {
        super();

        this.addressViewModel = new AddressViewModel();

        console.log(Common._modelAssemblyName);
        common.GetJsonEnum('AddressType');

        $(this._toolBarSelector).find('button[data-buttontype="add"]').bind('click',
            () => {
                address.addressViewModel.ClearData();
                $('#addressEditorModal').modal('show');
            });

        $(this._toolBarSelector).find('button[data-buttontype="edit"]').bind('click',
            () => {
                address.addressViewModel.RefreshData(address.SelectedRow);
                $('#addressEditorModal').modal('show');
            });

        $(this._toolBarSelector).find('button[data-buttontype="delete"]').bind('click',
            () => {
                //address.Delete();
            });
    }

    public LoadDataGrid(selector: string = this._gridSelector) {
        $(selector).datagrid({
            idField: 'Id'
            , toolbar: this._toolBarSelector
            , rownumbers: true
            , pagination: true
            , singleSelect: true
            , striped: true
            , loadMsg: dataGridHelper.LoadMessage
            , columns: [[
                { field: 'Id', hidden: true }
                , { field: 'PersonId', hidden: true }
                , { field: 'DateIns', hidden: true }
                , { field: 'LastUpdate', hidden: true }
                , { field: 'AddressTypeId', hidden: true }
                , { field: 'Street', title: 'Endereço', width: 200 }
                , { field: 'Number', title: 'Nº', width: 60 }
                , { field: 'Complement', title: 'Complemento', width: 110 }
                , {
                    field: 'ZipCode'
                    , title: 'CEP'
                    , width: 100
                    , formatter: function (value, row, index) {
                        return '<span name="spanZipCode">' + value + '</span>';
                    }
                }
                , {
                    field: 'AddressType'
                    , title: 'Tipo'
                    , width: 150
                }
                , { field: 'City', title: 'Cidade', width: 80 }
                , { field: 'State', title: 'UF', width: 40 }
            ]]
            , onClickRow: function (index, row) {
                address.OnClickRow(index, row);
            }
            , onDblClickRow: function (index, row) {
                address.OnClickRow(index, row);
                $('#addressEditorModal').modal('show');
            }
            , loader: function (param, success, error) {
                dataGridHelper.Loader('/Address/GetList', { personId: person.Id }, success, error);
            }
            , onLoadSuccess: function (items) {
                if (common.EnableLogGlobal) {
                    console.log('address.LoadDataGrid onLoadSuccess');
                }

                dataGridHelper.CollapseBoxAfterLoad(this);
                $('[name="spanZipCode"]').mask('00000-000');
            }
        });
    }

    private OnClickRow(index, row) {
        this.SelectedIndex = index;
        this.SelectedRow = row;
        this.addressViewModel.RefreshData(row);

        $(this._toolBarSelector).find('button[data-buttontype="edit"], button[data-buttontype="delete"]').removeAttr('disabled');
    }
}
var address = new Address();