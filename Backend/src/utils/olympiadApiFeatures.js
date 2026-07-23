class OlympiadApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Search
  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        $or: [
          {
            title: {
              $regex: this.queryString.search,
              $options: "i",
            },
          },
          {
            description: {
              $regex: this.queryString.search,
              $options: "i",
            },
          },
        ],
      });
    }

    return this;
  }

  // Filters
  filter() {
    const queryObj = { ...this.queryString };

    const removeFields = [
      "search",
      "page",
      "limit",
      "sort",
    ];

    removeFields.forEach((field) => delete queryObj[field]);

    if (queryObj.educationLevel) {
      this.query = this.query.find({
        educationLevel: queryObj.educationLevel,
      });
    }

    if (queryObj.olympiadType) {
      this.query = this.query.find({
        olympiadType: queryObj.olympiadType,
      });
    }

    if (queryObj.board) {
      this.query = this.query.find({
        boards: queryObj.board,
      });
    }

    if (queryObj.category) {
      this.query = this.query.find({
        category: queryObj.category,
      });
    }

    if (queryObj.gender) {
      this.query = this.query.find({
        gender: queryObj.gender,
      });
    }

    if (queryObj.nationality) {
      this.query = this.query.find({
        nationality: queryObj.nationality,
      });
    }

    if (queryObj.examMode) {
      this.query = this.query.find({
        examMode: queryObj.examMode,
      });
    }

    if (queryObj.featured) {
      this.query = this.query.find({
        featured: queryObj.featured === "true",
      });
    }

    if (queryObj.state) {
      this.query = this.query.find({
        "locations.state": queryObj.state,
      });
    }

    if (queryObj.city) {
      this.query = this.query.find({
        "locations.cities": queryObj.city,
      });
    }

    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Pagination
  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.skip(skip).limit(resultPerPage);

    return this;
  }
}

module.exports = OlympiadApiFeatures;