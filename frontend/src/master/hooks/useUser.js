import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAddres, deleteAddress, getAddress, updateAddress } from "../api";
import { useImmer } from "use-immer";

export const useUser = ({ load = false }) => {
  const queryClient = useQueryClient();
  const initalStatevalue = {
    name: "",
    contact: "",
    address: "",
    city: "",
    pincode: "",
    country: "",
  };
  const [newAddress, setNewAddress] = useImmer(initalStatevalue);
  const [editingAddress, setEditingAddress] = useImmer(null);

  const getUserAddressQuery = useQuery({
    queryKey: ["GET_USER_ADDRESS"],
    queryFn: getAddress,
    enabled: load,
  });

  const { data: addresses, isLoading } = getUserAddressQuery;

  const addAddressMutation = useMutation({
    mutationFn: createAddres,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_USER_ADDRESS"] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_USER_ADDRESS"] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_USER_ADDRESS"] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const handleAddAddress = () => {
    addAddressMutation.mutate(newAddress);
    setNewAddress(initalStatevalue);
  };

  const handleUpdateAddress = (id) => {
    updateAddressMutation.mutate({ editingAddress, id });
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id) => {
    deleteAddressMutation.mutate(id);
  };

  const handleEditChange = ({ name, value }) => {
    setEditingAddress((draft) => {
      draft[name] = value;
      return draft;
    });
  };

  const handleCreateChange = ({ name, value }) => {
    setNewAddress((draft) => {
      draft[name] = value;
      return draft;
    });
  };

  return {
    addresses,
    isLoading,
    newAddress,
    editingAddress,
    handleAddAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleEditChange,
    handleCreateChange,
    setEditingAddress,
  };
};
