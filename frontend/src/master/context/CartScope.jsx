import React, { useContext, createContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart, getWishlist, toggleWishlist, useAppScope } from "..";
import { errorMessage, successMessage } from "../../utils";

const CartContext = createContext();

export const CartScope = (props) => {
  const queryClient = useQueryClient();
  const [CartState, setCartState] = useImmer({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0
  });

  const [WishListState, setWishListState] = useImmer([]);

  const {
    AppState: { accessToken },
  } = useAppScope();

  const cartListQuery = useQuery({
    queryKey: ["GET_CART"],
    queryFn: getCart,
    enabled: !!accessToken,
  });

  const wishListQuery = useQuery({
    queryKey: ["GET_WISHLIST"],
    queryFn: getWishlist,
    enabled: !!accessToken,
  });

  const { data, isLoading } = !!cartListQuery && cartListQuery
  const { data: wishListData, isLoading: isWishListLoading } = !!wishListQuery && wishListQuery

  useEffect(() => {
    if (data) {
      const subtotal = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let total = subtotal;

      if (CartState.coupon) {
        const discount = subtotal * (coupon.discountPercentage / 100);
        total = subtotal - discount;
      }
      setCartState((draft) => {
        draft.cart = data;
        draft.subtotal = subtotal;
        draft.total = total;
        return draft
      })
    }
  }, [data])

  useEffect(() => {
    if (!!wishListData && !isWishListLoading) {
      setWishListState(wishListData)
    }
  }, [wishListData])

  const toggleWishListMutation = useMutation({
    mutationFn: toggleWishlist,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_WISHLIST"] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  return (
    <CartContext.Provider
      value={{
        CartState,
        setCartState,
        isLoading,
        WishListState,
        setWishListState,
        isWishListLoading,
        toggleWishListMutation
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export const useCartScope = () => useContext(CartContext);
