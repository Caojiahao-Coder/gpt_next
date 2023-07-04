import db from "@/database/db";
import type { NewGlobalSettingInfo, TBGlobalSettingInfo } from "@/database/table-type";
import { defineStore } from "pinia";

const useGlobalStore = defineStore('globalStore', () => {

  function getApiKey(): Promise<string> {
    return new Promise((reslove, reject) => {
      db.init().then(
        () => {
          db.selectAll('tb_global').then(res => {
            reslove(((res as TBGlobalSettingInfo[]).reverse()[0] as TBGlobalSettingInfo).api_key)
          })
        }
      )
    })
  }

  function getGlobalSetting(): Promise<TBGlobalSettingInfo> {
    return new Promise((reslove, reject) => {
      db.init().then(() => {
        db.selectAll('tb_global').then(res => {
          reslove(((res as TBGlobalSettingInfo[]).reverse()[0] as TBGlobalSettingInfo))
        })
      })
    })
  }

  function addApiKey(data: NewGlobalSettingInfo) {
    db.init().then(() => {
      db.add('tb_global', data)
    })
  }


  return {
    addApiKey,
    getApiKey,
    getGlobalSetting
  }
})

export default useGlobalStore
