package org.projectodd.nodej;

import org.dynjs.runtime.DynObject;
import org.dynjs.runtime.DynThreadContext;

/**
 * A <code>Process</code> is a node.js application.
 * 
 * @author Bob McWhirter
 */
public class Process extends DynObject {

	public Process() {
		setProperty("title", DynThreadContext.UNDEFINED);
	}

	public void setTitle(String title) {
		setProperty("title", title);
	}

	public String getTitle() {
		return (String) getProperty("title").getAttribute("value");
	}

}
