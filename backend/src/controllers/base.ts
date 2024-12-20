import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import APIFeatures from "../utils/APIFeatures";
import type { Model } from "mongoose";

export const deleteOne = async (model: Model<any>, req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'));
        }

        res.status(204).json({
            data: {
                status: 'success',
            }
        });
    } catch (error) {
        next(error);
    }
}

export const updateOne = async (model: Model<any>, req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'));
        }

        res.status(200).json({
            data: {
                status: 'success',
                data: doc,
            }
        });

    } catch (error) {
        next(error);
    }
}

export const createOne = async (model: Model<any>, req: Request, res: Response, next: NextFunction) => {
    try {
        const doc = await model.create(req.body);

        res.status(201).json({
            data: {
                status: 'success',
                data: doc,
            }
        });

    } catch (error) {
        next(error);
    }
}

export const getOne = async (model: Model<any>, req: Request, res: Response, next: NextFunction) => {
    try {
        const isList = req.params.id.startsWith('[') && req.params.id.endsWith(']');
        const doc = isList? await model.find({_id: req.params.id.slice(1, -1).split(',')}) : await model.findById(req.params.id);

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'));
        }

        console.log({
            data: {
                status: 'success',
                data: doc,
            },
        })

        res.status(200).json({
            data: {
                status: 'success',
                data: doc,
            },
        });
    } catch (error) {
        next(error);
    }
}

export const getAll = async (model: Model<any>, req: Request, res: Response, next: NextFunction) => {
    try {
        const features = new APIFeatures(model.find(), req.query)
            .sort();

        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                status: 'success',
                results: doc.length,
                data: doc,
            }
        });

    } catch (error) {
        next(error);
    }
}
