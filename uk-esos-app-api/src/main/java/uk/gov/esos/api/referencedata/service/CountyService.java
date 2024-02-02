package uk.gov.esos.api.referencedata.service;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.referencedata.domain.County;
import uk.gov.esos.api.referencedata.repository.CountyRepository;

import java.util.List;

@Service("countyService")
public class CountyService implements ReferenceDataService<County>{

	private final CountyRepository countyRepository;

	public CountyService(CountyRepository countyRepository) {
		this.countyRepository = countyRepository;
	}
	
	@Override
	public List<County> getReferenceData() {
		return this.getAllCounties();
	}

	public List<County> getAllCounties(){
		return this.countyRepository.findAll();
	}
}
