import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesController {
  static async postUpload(req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const {
      name, type, parentId, isPublic, data,
    } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'image', 'file'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId) {
      const parentFile = await dbClient.File('get', {
        _id: ObjectId(parentId),
      });
      if (!parentFile) return res.status(400).json({ error: 'Parent not found' });
      if (parentFile.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
    }

    const Data = {
      userId: ObjectId(userId),
      name,
      type,
      isPublic: isPublic || false,
      parentId: parentId ? ObjectId(parentId) : '0',
    };
    if (type === 'folder') {
      const addFolder = await dbClient.File('set', Data);
      Data.parentId = Data.parentId === '0' ? 0 : Data.parentId;
      return res.status(201).json({ id: addFolder.insertedId, ...Data });
    }

    const currentPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const fileName = uuidv4();
    const localPath = path.join(currentPath, fileName);

    await fs.promises.mkdir(currentPath, { recursive: true });
    await fs.promises.writeFile(localPath, Buffer.from(data, 'base64'));

    const addFile = await dbClient.File('set', { localPath, ...Data });
    Data.parentId = Data.parentId === '0' ? 0 : ObjectId(parentId);
    return res.status(201).json({ id: addFile.insertedId, localPath, ...Data });
  }

  static async getShow(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.param;

    const file = await dbClient.File('get', {
      _id: ObjectId(id),
      userId: ObjectId(userId),
    });
    if (!file) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(file);
  }

  static async getIndex(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    let userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const parentId = req.query.parentId ? ObjectId(req.query.parentId) : '0';
    userId = ObjectId(userId);
    const filesCount = await dbClient.File('count', { userId, parentId });

    if (filesCount === '0') return res.json([]);

    const skip = (parseInt(req.query.page, 10) || 0) * 20;
    const files = await dbClient
      .File('pagination', [
        { $match: { userId, parentId } },
        { $skip: skip },
        { $limit: 20 },
      ])
      .toArray();

    const modifyResult = files.map((file) => ({
      ...file,
      id: file._id,
      _id: undefined,
    }));

    return res.json(modifyResult);
  }
}

export default FilesController;
