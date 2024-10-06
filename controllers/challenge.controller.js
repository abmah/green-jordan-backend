

import {
  assignDailyChallengesService,
  getAvailableFreeChallengesService,
  completeChallengeService,
  createChallengeService,
  updateChallengeService,
  deleteChallengeService,
  populateChallengesFromFileService,
  getLeaderboardService
} from '../services/challenge.service.js';

export const assignDailyChallenges = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const response = await assignDailyChallengesService(userId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};


export const getAvailableFreeChallenges = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const response = await getAvailableFreeChallengesService(userId);
    res.status(200).json(response);
  } catch (error) {
    next(new Error('Failed to fetch free challenges. Please try again later.'));
  }
};

export const completeChallenge = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const { challengeId } = req.params;
    const response = await completeChallengeService(userId, challengeId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createChallenge = async (req, res, next) => {
  try {
    const response = await createChallengeService(req.body);
    res.status(201).json(response);
  } catch (error) {
    next(new Error('Failed to create challenge. Please try again later.'));
  }
};

export const updateChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await updateChallengeService(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    next(new Error('Failed to update challenge. Please try again later.'));
  }
};

export const deleteChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await deleteChallengeService(id);
    res.status(200).json(response);
  } catch (error) {
    next(new Error('Failed to delete challenge. Please try again later.'));
  }
};

export const populateChallengesFromFile = async (req, res, next) => {
  try {
    const response = await populateChallengesFromFileService();
    res.status(200).json(response);
  } catch (error) {
    next(new Error('Failed to populate challenges from file. Please try again later.'));
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const response = await getLeaderboardService();
    res.status(200).json(response);
  } catch (error) {
    next(new Error('Failed to fetch leaderboard. Please try again later.'));
  }
};
