import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const vehicleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Adding Vehicle
    addVehicle: builder.mutation({
      query: (data) => ({
        url: "/vehicle/create-vehicle",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["vehicle"],
    }),

    // Getting All Vehicles
    getVehicles: builder.query({
      query: (data) => ({
        url: `/vehicle/get-vehicle-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["vehicle"],
    }),

    // Getting Single Vehicle
    getSingleVehicle: builder.query({
      query: (id) => ({
        url: `/vehicle/get-vehicle-single/${id}`,
      }),
      providesTags: ["vehicle"],
    }),

    // Updating Vehicle
    updateVehicle: builder.mutation({
      query: ({ id, data }) => ({
        url: `/vehicle/update-vehicle/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["vehicle"],
    }),

    // Deleting Vehicle
    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/vehicle/delete-vehicle/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["vehicle"],
    }),
  }),
});

export const {
  useAddVehicleMutation,
  useDeleteVehicleMutation,
  useGetSingleVehicleQuery,
  useGetVehiclesQuery,
  useUpdateVehicleMutation,
} = vehicleApi;
