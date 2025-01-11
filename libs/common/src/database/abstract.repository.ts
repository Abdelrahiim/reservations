import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  /**
   * Create a new document and save it to the database.
   * @param document the document to be created, without an _id
   * @returns the created document with an _id
   */
  async create(document: Omit<TDocument, '_id'>) {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  /**
   * Find a single document that matches the given filterQuery.
   * If no document matches, throw a NotFoundException.
   * @param filterQuery the query to filter the documents
   * @returns the found document
   * @throws {NotFoundException} if no document matches
   */
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  /**
   * Find multiple documents that match the given filterQuery.
   * If no documents match, throw a NotFoundException.
   * @param filterQuery the query to filter the documents
   * @returns the found documents
   * @throws {NotFoundException} if no documents match
   */
  async find(filterQuery: FilterQuery<TDocument>) {
    const documents = await this.model.find(filterQuery).lean<TDocument[]>(true);
    if (!documents) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return documents;
  }

  /**
   * Find a single document that matches the given filterQuery and update it.
   * If no document matches, throw a NotFoundException.
   * @param filterQuery the query to filter the documents
   * @param update the properties to update
   * @returns the updated document
   * @throws {NotFoundException} if no document matches
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  /**
   * Find a single document that matches the given filterQuery and delete it.
   * If no document matches, throw a NotFoundException.
   * @param filterQuery the query to filter the documents
   * @returns true if the document was deleted, false otherwise
   * @throws {NotFoundException} if no document matches
   */
  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<boolean> {
    const deletedDocument = await this.model
      .findOneAndDelete(filterQuery)
      .lean<TDocument>(true);
    if (!deletedDocument) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return true;
  }
}
