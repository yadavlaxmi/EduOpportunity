class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Search
  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        title: {
          $regex: this.queryString.search,
          $options: "i",
        },
      });
    }

    return this;
  }

  // Filter
  filter() {
    const queryObj = { ...this.queryString };

    const removeFields = [
      "search",
      "page",
      "limit",
      "sort",
    ];

    removeFields.forEach((field) => delete queryObj[field]);

    if (queryObj.scholarshipType) {
      this.query = this.query.find({
        scholarshipType: queryObj.scholarshipType,
      });
    }

    if (queryObj.educationLevel) {
      this.query = this.query.find({
        educationLevel: queryObj.educationLevel,
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

    if (queryObj.applicationMode) {
      this.query = this.query.find({
        applicationMode: queryObj.applicationMode,
      });
    }

    if (queryObj.featured) {
      this.query = this.query.find({
        featured: queryObj.featured === "true",
      });
    }

    if (queryObj.minimumPercentage) {
      this.query = this.query.find({
        minimumPercentage: {
          $gte: Number(queryObj.minimumPercentage),
        },
      });
    }

    if (queryObj.annualIncomeLimit) {
      this.query = this.query.find({
        annualIncomeLimit: {
          $lte: Number(queryObj.annualIncomeLimit),
        },
      });
    }

    return this;
  }

  // Sort
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Pagination
  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = APIFeatures;