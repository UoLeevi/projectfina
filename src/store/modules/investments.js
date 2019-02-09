
const state = {
  watchlists: [
    {
      uuid: "7648709a-373d-4578-a414-b59e17a73a32",
      name: "Innovation",
      securities: []
    },
    {
      uuid: "ed9ee7b7-6ef1-4fdc-93fb-eff7fd6f3d20",
      name: "Growth",
      securities: [
        {
          uuid: "aa86bf2e-9f30-4abd-8c12-68c9084f72db",
          company: {
            name: "Talenom Oyj"
          },
          symbol: "TNOM"
        }
      ]
    },
    {
      uuid: "bb28a92b-5224-432c-a8af-501418f94f58",
      name: "Value",
      securities: [
        {
          uuid: "8cb570b4-f68e-4f29-955f-66b6a1ffb9fb",
          company: {
            name: "Nokia Oyj"
          },
          symbol: "NOKIA"
        },
        {
          uuid: "4c393cbd-6982-45f4-8a06-18091531c927",
          company: {
            name: "Fortum Oyj"
          },
          symbol: "FORTUM"
        },
        {
          uuid: "22c290c3-a342-4149-bc87-87762922a566",
          company: {
            name: "Nordea Bank Abp"
          },
          symbol: "NDA FI"
        }
      ]
    }
  ]
};

const getters = {

};

const actions = {
};

const mutations = {

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};