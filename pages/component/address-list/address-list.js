const App = getApp()

Page({
    data: {
        address: {},
        prompt: {
            hidden: !0,
            icon: '../../../image/iconfont-addr-empty.png',
            title: '还没有收货地址呢',
            text: '暂时没有相关数据',
        },
        items:[
            {
                address:"上海市黄浦区大道188号",
                is_def:true,
                name:"金三顺",
                tel:"13188888888",
                id:1
            },
            {
                address:"上海市黄浦区大道199号",
                is_def:false,
                name:"金er顺",
                tel:"13199999999",
                id:2
            }
        ]
    },
    onLoad() {
        // this.onPullDownRefresh()
        this.setData({
            'prompt.hidden': this.data.items.length,
        })
    },
    // initData() {
    //     this.setData({
    //         address: {
    //             items: [],
    //             params: {
    //                 page : 1,
    //                 limit: 10,
    //             },
    //             paginate: {}
    //         }
    //     })
    // },
    toAddressEdit(e) {
        console.log(e.currentTarget.dataset.id)
        wx.navigateTo({
            url:'../address-edit/address-edit?id='+e.currentTarget.dataset.id
        })
    },
    toAddressAdd(e) {
        console.log(e)
        wx.navigateTo({
            url:'../address/address'
        })
    },

    setDefalutAddress(e) {
        const id = e.currentTarget.dataset.id

    },
    getList() {
        const address = this.data.address
        const params = address.params

        // App.HttpService.getAddressList(params)
        this.address.queryAsync(params)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                address.items = [...address.items, ...data.data.items]
                address.paginate = data.data.paginate
                address.params.page = data.data.paginate.next
                address.params.limit = data.data.paginate.perPage
                this.setData({
                    address: address,
                    'prompt.hidden': address.items.length,
                })
            }
        })
    },
    // onPullDownRefresh() {
    //     this.initData()
    //     this.getList()
    // },
    // onReachBottom() {
    //     if (!this.data.address.paginate.hasNext) return
    //     this.getList()
    // },
})