/**
 * ApiFeatures Class
 * Provides reusable query features: search, filter, sort, pagination
 * Used with Mongoose query objects to build dynamic database queries
 */
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;       // Mongoose Query object
    this.queryStr = queryStr; // Request query string (req.query)
  }

  /**
   * Search by keyword in title or description
   */
  search() {
    const keyword = this.queryStr.search
      ? {
          $or: [
            { title: { $regex: this.queryStr.search, $options: 'i' } },
            { description: { $regex: this.queryStr.search, $options: 'i' } },
            { location: { $regex: this.queryStr.search, $options: 'i' } },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  /**
   * Filter by status, department, priority
   */
  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove fields that are not for filtering
    const removeFields = ['search', 'sort', 'page', 'limit'];
    removeFields.forEach((el) => delete queryCopy[el]);

    // Apply filters if provided
    const filterObj = {};
    if (queryCopy.status) filterObj.status = queryCopy.status;
    if (queryCopy.department) filterObj.department = queryCopy.department;
    if (queryCopy.priority) filterObj.priority = queryCopy.priority;

    this.query = this.query.find(filterObj);
    return this;
  }

  /**
   * Sort results
   * Options: latest (newest first), oldest, priority
   */
  sort() {
    if (this.queryStr.sort) {
      switch (this.queryStr.sort) {
        case 'oldest':
          this.query = this.query.sort({ createdAt: 1 });
          break;
        case 'priority':
          // Sort by priority: Urgent > High > Medium > Low
          this.query = this.query.sort({ priority: -1 });
          break;
        case 'latest':
        default:
          this.query = this.query.sort({ createdAt: -1 });
          break;
      }
    } else {
      // Default: newest first
      this.query = this.query.sort({ createdAt: -1 });
    }
    return this;
  }

  /**
   * Paginate results
   */
  paginate(resultsPerPage = 10) {
    const currentPage = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || resultsPerPage;
    const skip = limit * (currentPage - 1);

    this.query = this.query.limit(limit).skip(skip);
    this.currentPage = currentPage;
    this.limit = limit;
    return this;
  }
}

module.exports = ApiFeatures;
