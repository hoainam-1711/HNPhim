import "./MovieFilter.css";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import useFilterData from "../../hooks/useFilterData";

const SORT_LANG_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "vietsub", label: "Vietsub" },
  { value: "thuyet-minh", label: "Thuyết Minh" },
  { value: "long-tieng", label: "Lồng Tiếng" },
];

const SORT_FIELD_OPTIONS = [
  { value: "", label: "Mặc định (Mới cập nhật)" },
  { value: "modified.time", label: "Thời gian cập nhật" },
  { value: "year", label: "Năm phát hành" },
  { value: "_id", label: "Mới thêm" },
];

const SORT_TYPE_OPTIONS = [
  { value: "", label: "Mặc định (Giảm dần)" },
  { value: "desc", label: "Giảm dần" },
  { value: "asc", label: "Tăng dần" },
];

const MIN_YEAR = 1911; // Năm phát hành phim đầu tiên trên thế giới

const createYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= MIN_YEAR; year -= 1) {
    years.push(String(year));
  }
  return years;
};

const EMPTY_DRAFT = {
  category: [],
  country: [],
  year: [],
  sort_field: "",
  sort_type: "",
  sort_lang: "",
};

/**
 * MovieFilter: Bộ lọc đa tham số cho trang MovieCatalogPage
 * Hỗ trợ chọn nhiều thể loại, nhiều quốc gia, nhiều năm phát hành cùng ngôn ngữ và sắp xếp
 */
export const MovieFilter = ({
  mode = "type",
  filters = EMPTY_DRAFT,
  activeFilterCount = 0,
  onApply,
  onReset,
  onRemoveFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(() => ({
    category: filters.category || [],
    country: filters.country || [],
    year: filters.year || [],
    sort_field: filters.sort_field || "",
    sort_type: filters.sort_type || "",
    sort_lang: filters.sort_lang || "",
  }));

  // Đồng bộ draft khi URL filters thay đổi từ bên ngoài (xóa chip, chuyển danh mục, nút Back)
  const filtersSignature = JSON.stringify(filters);
  useEffect(() => {
    setDraft({
      category: filters.category || [],
      country: filters.country || [],
      year: filters.year || [],
      sort_field: filters.sort_field || "",
      sort_type: filters.sort_type || "",
      sort_lang: filters.sort_lang || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersSignature]);

  // Tải danh sách Thể loại & Quốc gia để hiển thị chọn lọc và ánh xạ tên cho chip đang bật
  const shouldLoadMeta = isOpen || activeFilterCount > 0;
  const {
    data: filterData,
    loading: metaLoading,
    error: metaError,
  } = useFilterData(shouldLoadMeta);

  const genres = useMemo(() => filterData?.genres || [], [filterData]);
  const countries = useMemo(() => filterData?.countries || [], [filterData]);
  const years = useMemo(() => createYearOptions(), []);

  // Bản đồ slug -> tên hiển thị cho các chip đang áp dụng
  const genreNameMap = useMemo(
    () => new Map(genres.map((item) => [item.slug, item.name])),
    [genres],
  );
  const countryNameMap = useMemo(
    () => new Map(countries.map((item) => [item.slug, item.name])),
    [countries],
  );

  // Ẩn bộ lọc trùng với ngữ cảnh hiện tại của trang
  const showCategoryFilter = mode !== "genre";
  const showCountryFilter = mode !== "country";

  const toggleMultiValue = (key, value) => {
    setDraft((prev) => {
      const currentList = prev[key] || [];
      const exists = currentList.includes(value);
      const nextList = exists
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return { ...prev, [key]: nextList };
    });
  };

  const clearMultiGroup = (key) => {
    setDraft((prev) => ({ ...prev, [key]: [] }));
  };

  const setSingleValue = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const sanitized = {
      ...draft,
      category: showCategoryFilter ? draft.category : [],
      country: showCountryFilter ? draft.country : [],
    };
    onApply?.(sanitized);
    setIsOpen(false);
  };

  const handleReset = () => {
    setDraft(EMPTY_DRAFT);
    onReset?.();
  };

  // Xây dựng danh sách chip hiển thị các bộ lọc đang hoạt động
  const activeChips = useMemo(() => {
    const chips = [];

    if (showCategoryFilter) {
      (filters.category || []).forEach((slug) => {
        chips.push({
          key: "category",
          value: slug,
          label: `Thể loại: ${genreNameMap.get(slug) || slug}`,
        });
      });
    }

    if (showCountryFilter) {
      (filters.country || []).forEach((slug) => {
        chips.push({
          key: "country",
          value: slug,
          label: `Quốc gia: ${countryNameMap.get(slug) || slug}`,
        });
      });
    }

    (filters.year || []).forEach((yr) => {
      chips.push({
        key: "year",
        value: yr,
        label: `Năm: ${yr}`,
      });
    });

    if (filters.sort_lang) {
      const found = SORT_LANG_OPTIONS.find(
        (opt) => opt.value === filters.sort_lang,
      );
      chips.push({
        key: "sort_lang",
        value: filters.sort_lang,
        label: `Ngôn ngữ: ${found?.label || filters.sort_lang}`,
      });
    }

    if (filters.sort_field) {
      const found = SORT_FIELD_OPTIONS.find(
        (opt) => opt.value === filters.sort_field,
      );
      chips.push({
        key: "sort_field",
        value: filters.sort_field,
        label: `Sắp xếp: ${found?.label || filters.sort_field}`,
      });
    }

    if (filters.sort_type) {
      const found = SORT_TYPE_OPTIONS.find(
        (opt) => opt.value === filters.sort_type,
      );
      chips.push({
        key: "sort_type",
        value: filters.sort_type,
        label: `Thứ tự: ${found?.label || filters.sort_type}`,
      });
    }

    return chips;
  }, [
    filters,
    showCategoryFilter,
    showCountryFilter,
    genreNameMap,
    countryNameMap,
  ]);

  const draftSelectedCount =
    (showCategoryFilter ? draft.category.length : 0) +
    (showCountryFilter ? draft.country.length : 0) +
    draft.year.length +
    [draft.sort_field, draft.sort_type, draft.sort_lang].filter(Boolean).length;

  return (
    <div className="movie-filter-wrapper">
      {/* Thanh nút mở bộ lọc và các chip lọc đang bật */}
      <div className="movie-filter-toolbar">
        <button
          type="button"
          className={`movie-filter-toggle-btn ${isOpen ? "is-open" : ""} ${
            activeFilterCount > 0 ? "has-active" : ""
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          <SlidersHorizontal size={16} />
          <span>Bộ lọc</span>
          {activeFilterCount > 0 && (
            <span className="movie-filter-badge">{activeFilterCount}</span>
          )}
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {activeChips.length > 0 && (
          <div className="movie-filter-active-chips">
            {activeChips.map((chip) => (
              <span
                key={`${chip.key}-${chip.value}`}
                className="movie-filter-active-chip"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  className="movie-filter-active-chip-remove"
                  onClick={() => onRemoveFilter?.(chip.key, chip.value)}
                  aria-label={`Bỏ lọc ${chip.label}`}
                >
                  <X size={13} />
                </button>
              </span>
            ))}

            <button
              type="button"
              className="movie-filter-clear-all-btn"
              onClick={handleReset}
            >
              <RotateCcw size={12} />
              <span>Xóa tất cả</span>
            </button>
          </div>
        )}
      </div>

      {/* Bảng chọn tiêu chí lọc */}
      {isOpen && (
        <div className="movie-filter-panel">
          {/* Thể loại (Multi-select) */}
          {showCategoryFilter && (
            <div className="movie-filter-group">
              <div className="movie-filter-group-header">
                <div className="movie-filter-group-label">
                  <span>Thể loại</span>
                  <span className="movie-filter-group-hint">
                    (Chọn nhiều
                    {draft.category.length > 0
                      ? ` • ${draft.category.length} đã chọn`
                      : ""}
                    )
                  </span>
                </div>
                {draft.category.length > 0 && (
                  <button
                    type="button"
                    className="movie-filter-group-clear"
                    onClick={() => clearMultiGroup("category")}
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>

              {metaLoading ? (
                <div className="movie-filter-status-text">
                  Đang tải danh sách thể loại...
                </div>
              ) : metaError ? (
                <div className="movie-filter-status-text">
                  Không thể tải danh sách thể loại.
                </div>
              ) : (
                <div className="movie-filter-options movie-filter-options--scrollable">
                  {genres.map((genre) => {
                    const selected = draft.category.includes(genre.slug);
                    return (
                      <button
                        key={genre.id || genre._id || genre.slug}
                        type="button"
                        className={`movie-filter-chip ${selected ? "is-selected" : ""}`}
                        onClick={() => toggleMultiValue("category", genre.slug)}
                      >
                        {selected && <Check size={13} />}
                        <span>{genre.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Quốc gia (Multi-select) */}
          {showCountryFilter && (
            <div className="movie-filter-group">
              <div className="movie-filter-group-header">
                <div className="movie-filter-group-label">
                  <span>Quốc gia</span>
                  <span className="movie-filter-group-hint">
                    (Chọn nhiều
                    {draft.country.length > 0
                      ? ` • ${draft.country.length} đã chọn`
                      : ""}
                    )
                  </span>
                </div>
                {draft.country.length > 0 && (
                  <button
                    type="button"
                    className="movie-filter-group-clear"
                    onClick={() => clearMultiGroup("country")}
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>

              {metaLoading ? (
                <div className="movie-filter-status-text">
                  Đang tải danh sách quốc gia...
                </div>
              ) : metaError ? (
                <div className="movie-filter-status-text">
                  Không thể tải danh sách quốc gia.
                </div>
              ) : (
                <div className="movie-filter-options movie-filter-options--scrollable">
                  {countries.map((country) => {
                    const selected = draft.country.includes(country.slug);
                    return (
                      <button
                        key={country.id || country._id || country.slug}
                        type="button"
                        className={`movie-filter-chip ${selected ? "is-selected" : ""}`}
                        onClick={() =>
                          toggleMultiValue("country", country.slug)
                        }
                      >
                        {selected && <Check size={13} />}
                        <span>{country.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Năm phát hành (Multi-select) */}
          <div className="movie-filter-group">
            <div className="movie-filter-group-header">
              <div className="movie-filter-group-label">
                <span>Năm phát hành</span>
                <span className="movie-filter-group-hint">
                  (Chọn nhiều
                  {draft.year.length > 0
                    ? ` • ${draft.year.length} đã chọn`
                    : ""}
                  )
                </span>
              </div>
              {draft.year.length > 0 && (
                <button
                  type="button"
                  className="movie-filter-group-clear"
                  onClick={() => clearMultiGroup("year")}
                >
                  Bỏ chọn
                </button>
              )}
            </div>

            <div className="movie-filter-options movie-filter-options--scrollable">
              {years.map((year) => {
                const selected = draft.year.includes(year);
                return (
                  <button
                    key={year}
                    type="button"
                    className={`movie-filter-chip ${selected ? "is-selected" : ""}`}
                    onClick={() => toggleMultiValue("year", year)}
                  >
                    {selected && <Check size={13} />}
                    <span>{year}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ngôn ngữ, Sắp xếp theo, Thứ tự (Single-select) */}
          <div className="movie-filter-group">
            <div className="movie-filter-inline-grid">
              <div className="movie-filter-inline-col">
                <div className="movie-filter-group-header">
                  <div className="movie-filter-group-label">Ngôn ngữ</div>
                </div>
                <div className="movie-filter-options">
                  {SORT_LANG_OPTIONS.map((opt) => (
                    <button
                      key={opt.value || "all-lang"}
                      type="button"
                      className={`movie-filter-chip ${
                        draft.sort_lang === opt.value ? "is-selected" : ""
                      }`}
                      onClick={() => setSingleValue("sort_lang", opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="movie-filter-inline-col">
                <div className="movie-filter-group-header">
                  <div className="movie-filter-group-label">Sắp xếp theo</div>
                </div>
                <div className="movie-filter-options">
                  {SORT_FIELD_OPTIONS.map((opt) => (
                    <button
                      key={opt.value || "default-field"}
                      type="button"
                      className={`movie-filter-chip ${
                        draft.sort_field === opt.value ? "is-selected" : ""
                      }`}
                      onClick={() => setSingleValue("sort_field", opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="movie-filter-inline-col">
                <div className="movie-filter-group-header">
                  <div className="movie-filter-group-label">Thứ tự</div>
                </div>
                <div className="movie-filter-options">
                  {SORT_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value || "default-type"}
                      type="button"
                      className={`movie-filter-chip ${
                        draft.sort_type === opt.value ? "is-selected" : ""
                      }`}
                      onClick={() => setSingleValue("sort_type", opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="movie-filter-actions">
            <button
              type="button"
              className="movie-filter-btn-reset"
              onClick={handleReset}
              disabled={draftSelectedCount === 0 && activeFilterCount === 0}
            >
              <RotateCcw size={15} />
              <span>Đặt lại</span>
            </button>

            <button
              type="button"
              className="movie-filter-btn-apply"
              onClick={handleApply}
            >
              <Check size={16} />
              <span>
                Áp dụng
                {draftSelectedCount > 0 ? ` (${draftSelectedCount})` : ""}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieFilter;
