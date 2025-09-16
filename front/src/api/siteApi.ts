import api, { parseApiError } from './axios'

export const fetchSites = async (user_id: String) => {
  try {
    const res = await api.post('/site/getSites', { user_id })
    return res.data.sites
  } catch (e) {    
    throw parseApiError(e)
  }
};

export const createSite = async (siteName: String, user_id: String) => {
  try {
    const res = await api.post('/site/create', { siteName, user_id })
    return res.data
  } catch (e) {    
    throw parseApiError(e)
  }
};

export const getAllSites = async () => {
  try {
    const res = await api.get('/site/getSitesAdmin')
    return res.data.sites
  } catch (e) {    
    throw parseApiError(e)
  }
};

export const getSite = async (siteName: String) => {
  try {
    const res = await api.post('/site/getSite', { siteName })
    return res.data.site
  } catch (e) {    
    throw parseApiError(e)
  } 
};