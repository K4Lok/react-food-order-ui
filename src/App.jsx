import { useEffect, useState, useRef } from "react"
import Header from "./components/Header";
import MiddleTab from "./components/MiddleTab";

function App() {
  const [data, setData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="App h-screen w-screen flex flex-col items-center bg-slate-500">
      {/* Global Container */}
      <div className="div max-w-md w-[448px] mx-auto bg-white">
        {/* Nav Section */}
        <Header />

        {/* Store Info Container */}
        <MiddleTab />

        {/* Main Section */}
        <section id="main">
          <div className="relative h-[500px] grid grid-cols-7 pb-48 mt-7">
            {/* Left Scroll Section */}
            <div id="left-scroll-parent" className="h-[100%] col-span-2 flex flex-col bg-zinc-50 overflow-y-scroll overflow-x-hidden scrollbar-hide">
              <ul>
                {data.map((item, index) => {
                  return (
                    <li id={`left-scrollTo-${index}`} onClick={() => handleSelectIndex(index)} key={index} className={`${currentIndex == index && 'selected'} cursor-pointer hover:bg-zinc-200 p-4 active:scale-[103%]`}>
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
                                  <li key={item.name} className="cursor-pointer border-4 border-transparent hover:border-4 hover:border-zinc-200 rounded-md">
                                    <div className="flex flex-row space-x-2 ">
                                      {/* Item - Left */}
                                      <img className="w-24 h-24 bg-zinc-50 p-2 rounded-md" src={item.imgUrl} alt="" />
                                      {/* Item - Right */}
                                      <div className="flex flex-col space-y-3">
                                        <h5 className="font-semibold line-clamp-2">{item.name}</h5>
                                        <p className="text-xs line-clamp-1">此套餐包括主食3份，小食4份及aaaaaaa</p>
                                        <p className="text-xs text-gray-400">月售{Math.floor(Math.random() * 50)}</p>
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
          </div>
        </section>

      </div>
    </div>
  )
}

export default App
