from .utils.helpers import get_value, load_raw_data


class _StanfordClassicParser:

    def __init__(self, file_path):
        self.file_path = file_path
        self._raw_data = None

    def _load_raw_data(self):
        if self._raw_data is None:
            self._raw_data = load_raw_data(self.file_path, merge_duplicate_keys=True)
        return self._raw_data

    def _get_value(self, group_id, variable_id, default=None):
        if self._raw_data is None:
            self._load_raw_data()
        return get_value(self._raw_data, group_id, variable_id, default)
