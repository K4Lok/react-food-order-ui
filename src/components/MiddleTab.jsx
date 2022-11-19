import React from 'react'

export default function MiddleTab() {
  return (
    <>
        {/* Store Info Container */}
        <section id="store-info">
            <div className="relative flex flex-col bg-white rounded-md p-4 mx-4 -mt-14 shadow-md">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col w-[70%]">
                  <h1 className="text-2xl font-semibold truncate">McDdonald's (龍園店 Dragon Gsdfds</h1>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-orange-400 font-bold">4.6</span>
                    <span>距離125m</span>
                    <span>mFood送 11分鐘</span>
                  </div>
                </div>
                <img className="object-cover w-14 h-14" src="https://1000logos.net/wp-content/uploads/2017/03/McDonalds-logo.png" alt="" />
              </div>
              <p className="truncate">公告：外送價格和活動與堂食不同。為支持環保，部分飲品</p>
            </div>
        </section>
        
        {/* Switching Tab */}
        <div className="relative flex flex-row items-center justify-around pt-8 pb-4 font-bold text-xl border-b-[1px] border-gray-100">
            <button>點餐</button>
            <button>評價</button>
            <button>資料</button>
            {/* Shifting Underline */}
            <div className="absolute w-6 border-b-4 border-orange-400 rounded-full translate-y-5"></div>
          </div>

          {/* Image Section */}
          <div className="my-4 mx-4">
            <img className="rounded-lg h-32 w-full object-cover shadow-lg" src="https://i.pinimg.com/originals/ef/4c/4e/ef4c4e5c33e44954827b5fac40bb7358.jpg" alt="" />
          </div>
    </>
  )
}
