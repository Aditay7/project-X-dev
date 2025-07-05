const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      status,
      priority,
      category,
      search,
      sortBy,
      sortOrder = 'asc', // default: ascending
      dueDateFrom,
      dueDateTo,
    } = req.query;

    // Build dynamic query object
    const query = { user: userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    // Search (case-insensitive regex on title or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Due date filter
    if (dueDateFrom || dueDateTo) {
      query.dueDate = {};
      if (dueDateFrom) query.dueDate.$gte = new Date(dueDateFrom);
      if (dueDateTo) query.dueDate.$lte = new Date(dueDateTo);
    }

    // Sorting
    const sortField = sortBy || 'dueDate'; // default: dueDate
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(query).sort({ [sortField]: sortDirection });

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
