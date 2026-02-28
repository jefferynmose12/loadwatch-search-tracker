import axios from "axios";

export const APICLIENT = import.meta.env.VITE_API_BASE_URL;

export const fetchCliSearches = async (
  page = 1,
  page_size = 20,
  dat = "all",
  status = "ACTIVE",
  trucker = null,
) => {
  const res = (await axios.get)(`${APICLIENT}/loads/search/cli-searches`, {
    params: {
      page,
      limit: page_size,
      dat,
      status,
      ...(trucker && trucker.trim() ? { trucker: trucker.trim() } : {}),
    },
  });

  //console.log(res)

  return res;
};

export const fetchLoadsForSearch = async (searchId) => {
  const res = await axios.get(
    `${APICLIENT}/loads/search/cli-searches/${searchId}/loads`,
  );
  return res;
};
