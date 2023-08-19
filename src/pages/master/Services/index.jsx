import { BsPlus } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "./Form";
import Layout from "../../../layouts/index";
import Button from "../../../common/Button";
import {
  removeService,
  serviceList,
  updateService,
} from "../../../toolkit/action/serviceAction";
import Toggle from "../../../common/Toggle";
import Options from "../../../common/Options";
import { IMAGE_URL } from "../../../utils/endpoints";
import Pagination from "../../../common/Pagination";
import Confrimation from "../../../common/Confirmation";
import Loader from "../../../common/Loader";

const Services = () => {
  const dispatch = useDispatch();
  const [modals, setModals] = useState({
    formModal: false,
    deleteModal: false,
  });
  const [editData, setEditData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const { services, fetchLoad, loading } = useSelector(
    (state) => state.serviceReducer
  );

  // handle modals
  const handleOpenModal = (name) => setModals({ ...modals, [name]: true });
  const handleCloseModal = (name) => {
    setEditData();
    setModals({ ...modals, [name]: false });
  };

  // handle status update
  const handleStatusUpdate = async (event) => {
    const payload = { status: event.target.checked };
    const response = await dispatch(updateService(event.target.id, payload));
    if (response?.payload?.Status) {
      dispatch(serviceList());
    }
  };

  // handle remove service
  const handleDeleteService = async () => {
    const response = await dispatch(removeService(editData._id));
    if (response?.payload?.Status) {
      dispatch(serviceList());
      handleCloseModal("deleteModal");
    }
  };

  // Pagination Logic
  const perPageItems = 10;
  const totalItems = services?.length;
  const trimStart = (currentPage - 1) * perPageItems;
  const trimEnd = trimStart + perPageItems;
  const handlePrev = () => currentPage !== 1 && setCurrentPage(currentPage - 1);
  const handleForw = () => {
    trimEnd <= totalItems && setCurrentPage(currentPage + 1);
  };

  // useffect
  useEffect(() => {
    dispatch(serviceList());
  }, [dispatch]);

  return (
    <>
      {/* Top */}
      <div className="flex justify-between">
        <div> Services</div>
        <Button
          icon={<BsPlus />}
          action={() => handleOpenModal("formModal")}
          text="New Service"
        />
      </div>

      {/* Table */}
      <div className="w-full bg-white my-3 rounded shadow-md p-3 mx-auto overflow-auto">
        <div className="rounded text-left whitespace-no-wrap w-full border overflow-auto">
          <table className="table-auto divide-y whitespace-nowrap w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl">
                  Name
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Percent
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Type
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Status
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                  Coupon Applicable
                </th>
                <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr ">
                  Action
                </th>
              </tr>
            </thead>
            {fetchLoad ? (
              <td colSpan={6} className="py-6">
                <Loader />
              </td>
            ) : (
              <tbody className="divide-y">
                {services?.slice(trimStart, trimEnd).map((item) => {
                  return (
                    <tr key={item._id} className="text-sm ">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            alt={item._id}
                            src={`${IMAGE_URL}${item.icon}`}
                            className="w-9 h-9 rounded-full"
                          />{" "}
                          {item.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">{item.percent}%</td>
                      <td className="px-4 py-3">{item.type}</td>
                      <td className="px-4 py-3">
                        <Toggle
                          _id={item._id}
                          value={item.status}
                          handleChange={handleStatusUpdate}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Toggle
                          _id={item._id + item._id}
                          value={item.isCoupon}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Options
                          handleEdit={() => {
                            setEditData(item);
                            handleOpenModal("formModal");
                          }}
                          handleDelete={() => {
                            setEditData(item);
                            handleOpenModal("deleteModal");
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
          <Pagination
            handlePrev={handlePrev}
            from={trimStart}
            to={trimEnd}
            total={totalItems}
            handleForw={handleForw}
          />
        </div>
      </div>

      {/* Form */}
      <Form
        isOpen={modals.formModal}
        handleCloseModal={() => handleCloseModal("formModal")}
        editData={editData}
      />

      {/* Confirmation */}
      <Confrimation
        isOpen={modals.deleteModal}
        editData={editData}
        loading={loading}
        handleConfirm={handleDeleteService}
        handleCancel={() => handleCloseModal("deleteModal")}
      />
    </>
  );
};

export default Layout(Services);
