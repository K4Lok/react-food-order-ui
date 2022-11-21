import { useEffect, useState, useRef } from "react"
import Header from "./components/Header";
import MiddleTab from "./components/MiddleTab";

function App() {
  // Lists of data
  const [data, setData] = useState([]);
  const [foods, setFoods] = useState([]);

  // States and Indexes
  const [isDataLoading, setIsDataLoading] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [selectedFoodIndex, setSelectedFoodIndex] = useState(null);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const rightScrollContainerRef = useRef();

  useEffect(() => {
    setIsDataLoading(true);
    fetch('/data.json')
      .then(res => res.json())
      .then(data => setData(data));
    setIsDataLoading(false);
  }, []);

  useEffect(() => {
    if(isDataLoading === null) return;

    if(isDataLoading === false) {
      const observer = new IntersectionObserver(([e]) => {
        if(e.isIntersecting) {
          const index = e.target.dataset.scrollIndex;
          if(index) {
            setCurrentIndex(index);
          }
        }
      }, {
        root: document.getElementById('right-scroll-list'),
        rootMargin: '0px 0px -100% 0px',
        threshold: 0,
        
      });

      setTimeout(() => {
        const stickyHeaders = rightScrollContainerRef.current.querySelectorAll('ul');
        stickyHeaders.forEach(header => {
          observer.observe(header);
        })
      }, 1000);
    }
  }, [isDataLoading]);

  useEffect(() => {
    if(data.length == 0) return;

    // Create new foods array from data list
    const _ = data.flatMap(category => category.foods);
    const foodsData = _.map(food => {
      return {
        ...food,
        quantity: 0
      }
    });
    setFoods(foodsData);
    console.log(foodsData);
  }, [data]);

  const handleSelectIndex = (index) => {
    setCurrentIndex(index);

    // Left list scroll handle
    // const leftEl = document.getElementById(`left-scroll-parent`);
    // if(leftEl) {
    //   leftEl.scrollTo({
    //     top: `${112 * index}`, // Left item is 112px height
    //     behavior: "smooth"
    //   });
    // }

    const rightEl = document.getElementById(`right-scrollTo-${index}`);
    if(rightEl) {
      rightEl.scrollIntoView({
        behavior: 'smooth'
      });
    }

    // Right list scroll handle
    // const rightEl = document.getElementById(`right-scroll-parent`);
    // if(rightEl) {
    //   rightEl.scrollTo({
    //     top: `${112 * index}`, // Left item is 112px height
    //     behavior: "smooth"
    //   });
    // }

    // scrollIntoView don't support for multiple elements scroll
  }

  const handleSelectFood = (index) => { // index: foodIndex from 0 to the len of foods list
    setSelectedFoodIndex(index);
    setShowSelectModal(true);
  }

  const handleCartItem = (number, selectedIndex=selectedFoodIndex) => {
    
    // https://stackoverflow.com/questions/63362057/react-setstate-with-certain-index - Genius approach
    setFoods(prev => {
      return [
        ...prev.slice(0, selectedIndex),
        {
          ...prev[selectedIndex],
          quantity: prev[selectedIndex].quantity + number
        },
        ...prev.slice(selectedIndex + 1, prev.length)
      ]
    });
  }

  const handleSubmitOrder = () => {
    setShowSelectModal(false);
    setShowCartModal(false);
  }

  return (
    <div className="App min-h-screen w-screen flex flex-col items-center bg-slate-500">
      {/* Global Container */}
      <div className="relative div max-w-md w-full mx-auto bg-white">
        {/* Nav Section */}
        <Header />

        {/* Store Info Container */}
        <MiddleTab />

        {/* Main Section */}
        <section id="main">
          <div className="relative h-[500px] grid grid-cols-7 pb-48 mt-7">
            {/* Left Scroll Section */}
            <div id="left-scroll-parent" className="h-full col-span-2 flex flex-col bg-zinc-50 overflow-y-scroll overflow-x-hidden scrollbar-hide">
              <ul>
                {data.map((item, index) => {
                  return (
                    <li id={`left-scrollTo-${index}`} onClick={() => handleSelectIndex(index)} key={index} className={`${currentIndex == index && 'selected'} cursor-pointer hover:bg-zinc-200 p-4`}>
                      <img className="px-5" src={item.imgUrl} alt="" />
                      <h3 className="px-2 text-center line-clamp-1 text-ellipsis" >{item.title}</h3>
                    </li>
                  )
                })}
              </ul>
            </div>
            {/* Right Scroll Section */}
            <div className="relative col-span-5">
              <div className="flex flex-col space-y-4 px-4">
                <h4 className="text-gray-500">開住餐睇波套餐 Game on! Feast</h4>
                {/* Item List Container */}
                <div ref={rightScrollContainerRef} id="right-scroll-list" className="h-[450px] overflow-y-scroll scrollbar-hide">
                  <ul className="flex flex-col space-y-2">
                    {
                      data.map((section, index) => {
                        return (
                          <li key={section.title}>
                            <ul data-scroll-index={index} className="space-y-3">
                              <h4 className="sticky top-0 bg-white">{section.title}</h4>
                              <div id={`right-scrollTo-${index}`} className="h-0 w-0 opacity-0"></div>
                              {section.foods.map(item => {
                                return (
                                  <li key={item.name} className="cursor-pointer border-4 border-transparent rounded-md">
                                    <div className="flex space-x-2 ">
                                      {/* Item - Left */}
                                      <img className="w-24 h-24 bg-zinc-50 p-2 rounded-md" src={item.imgUrl} alt="" />
                                      {/* Item - Right */}
                                      <div className="flex flex-col space-y-1">
                                        <h5 className="font-semibold line-clamp-2">{item.name}</h5>
                                        <p className="text-xs line-clamp-1">此套餐包括主食3份，小食4份及aaaaaaa</p>
                                        <p className="text-xs text-gray-400">月售{item.sold_record}</p>
                                        <div className="flex justify-between">
                                          <span className="text-[#FA6B16] text-xs font-semibold flex items-center">MOP<span className="text-sm px-1 -translate-y-[1px]">{item.price}</span><span className="font-normal">起</span></span>
                                          <div className="relative flex items-center">
                                            <button onClick={() => {handleSelectFood(item.id-1)}}  className="text-[0.65rem] px-1 bg-[#FA6B16] text-white rounded-[3px] active:scale-[102%]">選規格</button>
                                            {/* Quantity Indicator */}
                                            {
                                              foods[item.id-1]?.quantity > 0
                                                && <div className="absolute -top-[50%] right-0 bg-red-500 text-white h-4 w-4 rounded-full flex items-center justify-center">
                                                    <span className="text-[0.6rem]">{foods[item.id-1].quantity}</span>
                                                   </div>
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                )
                                })}
                            </ul>
                        </li>
                        )
                      })
                    }
                  </ul>
                </div>
              </div>

              
            </div>

            {/* Cart Section */}
            <div className="fixed bottom-6 w-full px-11 z-20 left-0 mx-auto">
              <div onClick={() => setShowCartModal(true)} className=" relative flex justify-between items-center p-1 inset-0 h-full w-full bg-[#3F3E5D] rounded-lg cursor-pointer">
                <div className="flex">
                  {/* <svg className="w-12 h-12 text-[#FA6B16] -rotate-[14deg]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg> */}
                  <svg className="w-10 h-10 text-[#FA6B16] -rotate-[8deg] translate-x-1 -translate-y-1 select-none cursor-default" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>

                  <span className="text-white ml-4 text-sm font-semibold flex items-center">MOP<span className="text-xl pl-2 -translate-y-[2px]">
                    {foods.filter(food => {
                      return food.quantity > 0;
                    }).length > 0 
                      ? foods.filter(food => {
                          return food.quantity > 0;
                        })?.reduce((sum, foodItem) => {
                          return sum + foodItem.quantity * foodItem.price;
                        }, 0)
                      : 0
                    }
                    </span></span>
                  </div>
                <button onClick={(e) => {e.stopPropagation();handleSubmitOrder();}} className="py-3 px-4 bg-[#FA6B16] text-white font-bold rounded-lg">提交訂單</button>
              </div>
            </div>
          </div>
        </section>

        {/* Absolute Food Selection Modal */}
        <section id="food-select-modal">
          <div onClick={() => {setShowSelectModal(false); setSelectedFoodIndex(null);}}
            className={`${showSelectModal ? 'block' : 'hidden'} absolute inset-0 bg-black/50 z-10 px-12 flex items-center`}
          >
            <div onClick={e => {e.stopPropagation()}} className="relative max-w-sm w-full bg-stone-50 rounded-md overflow-hidden">
              {
                selectedFoodIndex != null && (<>
                  <div className="p-4 space-y-4">
                    <h5 className="text-xl font-bold">{foods[selectedFoodIndex].name}</h5>
                    <div className="w-full h-40 bg-stone-200"></div>
                  </div>
                  {/* Bottom Row */}
                  <div className="flex h-10 justify-between items-center bg-white px-4">
                    {/* Left Group */}
                    <p className="space-x-1 flex items-center">
                      <span className="text-xs font-semibold">小計</span>
                      <span className="text-[0.7rem] font-bold text-[#F54C4B]">MOP</span>
                      <span className="text-lg font-bold text-[#F54C4B]">{foods[selectedFoodIndex].price}</span>
                      <span className="text-[0.7rem] text-gray-400 pl-1">/份</span>
                    </p>
                    {/* Right Group */}
                    <div className="">
                      {
                        foods[selectedFoodIndex].quantity == 0
                          ? <button onClick={() => handleCartItem(1)} className="px-2 py-1 bg-[#FA6B16] text-white text-sm font-semibold rounded-md">加入購物車</button> 
                          : <div className="flex items-center space-x-2">
                              <button onClick={() => handleCartItem(-1)} className="text-2xl font-bold text-[#e08856] active:text-[#975c3a] h-10">-</button>
                              <p className="text-lg font-bold h-6">{foods[selectedFoodIndex].quantity}</p>
                              <button onClick={() => handleCartItem(1)} className="text-xl font-extrabold text-[#FA6B16] active:text-[#975c3a] h-10 ">+</button>
                            </div> 
                      }
                      
                    </div>
                  </div>
                </>)
              }
            </div>
          </div>
        </section>

        {/* Absolute Cart Modal */}
        <section id="cart-modal">
          <div onClick={() => setShowCartModal(false)} className={`${showCartModal ? 'flex' : 'hidden'} absolute inset-0 bg-black/50 z-10 flex items-center`}>
              <div onClick={e => e.stopPropagation()} className={`absolute bottom-0 h-96 w-full bg-white rounded-t-lg p-4 space-y-4`}>
                <div className="flex justify-between">
                  <span>外賣盒</span>
                </div>
                <ul className="h-[70%] w-full overflow-y-auto overflow-x-hidden scrollbar-hide">
                  {foods.filter(food => {
                    return food.quantity > 0
                  }).map(item => {
                    return (
                      <li key={item.id}>
                        <div className="flex space-x-3">
                          {/* Item - Left */}
                          <img className="w-24 h-24 bg-zinc-50 p-2 rounded-md" src={item.imgUrl} alt="" />
                          {/* Item - Right */}
                          <div className="grow flex flex-col space-y-1">
                            <h5 className="font-semibold line-clamp-2">{item.name}</h5>
                            <p className="text-xs line-clamp-1">此套餐包括主食3份，小食4份及aaaaaaa</p>
                            <p className="text-xs text-gray-400">月售{item.sold_record}</p>
                            <div className="flex justify-between">
                              <span className="text-[#FA6B16] text-xs font-semibold flex items-center">MOP<span className="text-sm px-1 -translate-y-[1px]">{item.price}</span><span className="font-normal">起</span></span>
                              <div className="relative flex items-center">
                                <div className="flex items-center space-x-2">
                                  <button onClick={() => {handleCartItem(-1, item.id-1)}} className="text-2xl font-bold text-[#e08856] active:text-[#975c3a] h-10">-</button>
                                  <p className="text-lg font-bold h-6">{foods[item.id-1].quantity}</p>
                                  <button onClick={() => {handleCartItem(1, item.id-1)}} className="text-xl font-extrabold text-[#FA6B16] active:text-[#975c3a] h-10 ">+</button>
                                </div> 
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
