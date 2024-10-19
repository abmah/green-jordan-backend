import {
  createRedeemableService,
  updateRedeemableService,
  deleteRedeemableService,
  getAllRedeemablesService,
  getAvailableRedeemablesService,
  redeemItemService,
  getRedeemedItemsService,
} from '../services/redeemable.service.js';

export const createRedeemable = async (req, res, next) => {
  try {
    const response = await createRedeemableService(req.body);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateRedeemable = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await updateRedeemableService(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteRedeemable = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await deleteRedeemableService(id, req.body.adminId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllRedeemables = async (req, res, next) => {
  try {
    const response = await getAllRedeemablesService();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAvailableRedeemables = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const response = await getAvailableRedeemablesService(userId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const redeemItem = async (req, res, next) => {
  const { userId } = req.body;
  const { redeemableId } = req.params;

  try {
    const response = await redeemItemService(userId, redeemableId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getRedeemedItems = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const response = await getRedeemedItemsService(userId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
