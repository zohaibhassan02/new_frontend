"use client";
import React, { useState, useEffect } from "react";
import SideMenu from "@/components/sideMenu";
import TopNavbar from "@/components/topnavbar";
import MainContent from "@/components/maincontent";
import Banner from "@/components/banner";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "@/components/productCard";
import { getUserProductsByCategory, updateProductItem } from "@/lib/services/product";

export default function Home() {
  const [currentList, setCurrentList] = useState([]);
  const [draftList, setDraft] = useState([]);

  const GetAllList = async () => {
    try {
      const response = await getUserProductsByCategory({ category: "package" });
      console.log("API Response:", response.data); // Debugging line

      if (response.data.status === "success") {
        const data = response.data.data;
        let ActiveList = data.filter((i) => i.active);
        setCurrentList(ActiveList);
        let DraftList = data.filter((i) => !i.active);
        setDraft(DraftList);
      } else {
        console.error("API Error:", response.data.message); // Debugging line
      }
    } catch (error) {
      console.error("Fetch Error:", error); // Debugging line
    }
  };

  useEffect(() => {
    GetAllList();
  }, []);

  const UpdateProduct = async (id, bool) => {
    try {
      const response = await updateProductItem({
        _id: id,
        active: bool,
      });

      if (response.status === 200) {
        GetAllList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main-container">
      <SideMenu />
      <div className="overflow-hidden">
        <TopNavbar />
        <MainContent>
          <div className="container">
            <Banner bgImgSrc="/images/banner1.jpg" title="Your Digital Menu" />
            <div className="text-[22px] text-white font-semibold mb-2">Current Package List</div>
            <Swiper
              spaceBetween={30}
              breakpoints={{
                550: { slidesPerView: 1.25 },
                650: { slidesPerView: 1.5 },
                700: { slidesPerView: 1.75 },
                800: { slidesPerView: 2 },
                850: { slidesPerView: 2.25 },
                900: { slidesPerView: 2.5 },
                1000: { slidesPerView: 2.75 },
                1100: { slidesPerView: 3 },
              }}
              style={{ paddingBottom: 24 }}
            >
              {currentList.map((i) => {
                const formattedItems = i?.pricintList?.map((item) => `${item.size}oz - ${item.price}$`);
                return (
                  <SwiperSlide key={i._id}>
                    <ProductCard
                      recordId={i._id}
                      updateAction={() => {
                        UpdateProduct(i._id, false);
                      }}
                      bgImgSrc={i?.imageUrl}
                      num={i?.quantity}
                      title={i?.productName}
                      description={i?.description}
                      members={formattedItems}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <div className="text-[22px] text-white font-semibold mb-2">Inventory Package</div>
            <Swiper
              spaceBetween={30}
              breakpoints={{
                550: { slidesPerView: 1.25 },
                650: { slidesPerView: 1.5 },
                700: { slidesPerView: 1.75 },
                800: { slidesPerView: 2 },
                850: { slidesPerView: 2.25 },
                900: { slidesPerView: 2.5 },
                1000: { slidesPerView: 2.75 },
                1100: { slidesPerView: 3 },
              }}
              style={{ paddingBottom: 24 }}
            >
              {draftList.map((i) => {
                const formattedItems = i?.pricintList?.map((item) => `${item.size}oz - ${item.price}$`);
                return (
                  <SwiperSlide key={i._id}>
                    <ProductCard
                      recordId={i._id}
                      updateAction={() => {
                        UpdateProduct(i._id, true);
                      }}
                      bgImgSrc={i?.imageUrl}
                      num={i?.quantity}
                      title={i?.productName}
                      description={i?.description}
                      members={formattedItems}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </MainContent>
      </div>
    </div>
  );
}
