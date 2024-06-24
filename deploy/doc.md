cfg = rs.conf()

cfg.members[0].host = "103.72.99.224:27016"
cfg.members[1].host = "103.72.99.224:27017"
cfg.members[2].host = "103.72.99.224:27018"

rs.reconfig(cfg, { force: true })

rs.initiate({
  _id: "myReplicaSet",
  members: [
    { _id: 0, host: "103.72.99.224:27016" },
    { _id: 1, host: "103.72.99.224:27019" },
    { _id: 2, host: "103.72.99.224:27018" }
  ]
})

cấu hình replication public ra ngoài